import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  of,
  zip
} from 'rxjs';

import {
  map,
  withLatestFrom,
  shareReplay,
  tap
} from 'rxjs/operators';

import {
  Content,
  Config,
  Person,
  ContentType
} from '../../models';

import {
  MDBSearchResponseJSON,
  ContentParserService,
  MDBContentImagesJSON,
  MDBContentJSON
} from '../content-parser';

import {
  PeopleParserService,
  MDBCreditsJSON,
  MDBPersonJSON
} from '../people-parser';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
@Injectable({
  providedIn: 'root'
})
export class MoviedbDataService {

  private readonly apiKey = '422113b1d8f5bb170e051db92b9e84b5';
  private readonly baseUrl: string = 'https://api.themoviedb.org/3';
  private imgBaseUrl$: Observable<string>;

  constructor(
    private http: HttpClient,
    private contentParser: ContentParserService,
    private peopleParser: PeopleParserService
  ) {

    this.imgBaseUrl$ = this.http.get<Config>(`${this.baseUrl}/configuration?api_key=${this.apiKey}`)
      .pipe(
        map(config => `${config.images.base_url}/original/`),
        shareReplay(1)
      );
  }

  /**
     * Searches for content of any type matching the provided string (title)
     **/
  public getContentInfo(title: string): Observable<Content[]> {

    if (title === undefined || title === '') {
      return of([]);
    }

    const search$ = this.http.get<MDBSearchResponseJSON>(`${this.baseUrl}/search/multi?api_key=${this.apiKey}&query=${encodeURI(title)}`);

    return this.extractContentList(search$);
  }

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  public getContentDetails(type: ContentType, id: number): Observable<Content> {

    if (!type || !id) {
      throw new Error('#getContentDetails: content type and id should not be undefined');
    }
    const details$ = this.http.get<MDBContentJSON>(`${this.baseUrl}/${type}/${id}?api_key=${this.apiKey}`);
    const credits$ = this.http.get<MDBCreditsJSON>(`${this.baseUrl}/${type}/${id}/credits?api_key=${this.apiKey}`);

    return this.extractContentDetails(details$, credits$, type);
  }

  /**
   * Retrieves detailed information about someone
   * @param personId Person identifier for the MovieDB API
   */
  public getPersonDetails(personId: number, person?: Person): Observable<Person> {

    if (!personId) {
      throw new Error('#getPersonDetails: personId should not be undefined');
    }

    return this.http.get<MDBPersonJSON>(`${this.baseUrl}/person/${personId}?api_key=${this.apiKey}`)
      .pipe(withLatestFrom(this.imgBaseUrl$),
        map(([personJson, imgBaseUrl]) => this.peopleParser.parsePerson(personJson, imgBaseUrl, person)));
  }

  public getExtraImages(content: Content): Observable<string[]> {
    if (!content) {
      throw new Error('#getExtraImages : content should not be undefined');
    }

    return this.http.get<MDBContentImagesJSON>(`${this.baseUrl}/${content.type}/${content.tmdbId}/images?api_key=${this.apiKey}`)
      .pipe(
        withLatestFrom(this.imgBaseUrl$),
        map(([contentImgJson, imgBaseUrl]) => this.contentParser.parseContentImages(contentImgJson, imgBaseUrl, content))
      );
  }

  private extractContentList(search$: Observable<MDBSearchResponseJSON>): Observable<Content[]> {
    return search$.pipe(
      withLatestFrom(this.imgBaseUrl$),
      map(([response, imgBaseUrl]) => {
        return this.contentParser.parseContentList(response, imgBaseUrl).filter(content => !!content);
      }));
  }

  private extractContentDetails(
    details$: Observable<MDBContentJSON>,
    credits$: Observable<MDBCreditsJSON>,
    type: ContentType
  ): Observable<Content> {

    return zip(details$, credits$).pipe(withLatestFrom(this.imgBaseUrl$), map(([[contentDetail, credits], imgBaseUrl]) => {
      contentDetail.media_type = type;
      const content = this.contentParser.parse(contentDetail, imgBaseUrl);
      this.peopleParser.parseContentCredits(credits, content);
      return content;
    }));
  }
}
