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
  shareReplay
} from 'rxjs/operators';

import {
  Content,
  Config,
  Person
} from '../../models';

import {
  MDBSearchResponseJSON,
  MDBMovieJSON,
  MDBTvShowJSON,
  ContentParserService,
  MDBContentImagesJSON
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

    if (title === '') {
      return of([]);
    }

    const search$ = this.http.get<MDBSearchResponseJSON>(`${this.baseUrl}/search/multi?api_key=${this.apiKey}&query=${encodeURI(title)}`);

    return search$.pipe(
      withLatestFrom(this.imgBaseUrl$),
      map(([response, imgBaseUrl]) => this.parseContentList(response, imgBaseUrl)
      ));
  }

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  public getContentDetails(type: string, id: number): Observable<Content> {

    const credits$ = this.http.get<MDBCreditsJSON>(`${this.baseUrl}/${type}/${id}/credits?api_key=${this.apiKey}`);
    const details$ = this.http.get(`${this.baseUrl}/${type}/${id}?api_key=${this.apiKey}`);

    return zip(details$, credits$).pipe(
      withLatestFrom(this.imgBaseUrl$),
      map(([[contentDetail, credits], imgBaseUrl]: [[MDBMovieJSON | MDBTvShowJSON, MDBCreditsJSON], string]) => {
        let content: Content;
        if (type === 'movie') {
          content = this.contentParser.parseMovie((<MDBMovieJSON>contentDetail), credits, imgBaseUrl);
        } else if (type === 'tv') {
          content = this.contentParser.parseTvShow((<MDBTvShowJSON>contentDetail), credits, imgBaseUrl);
        }
        content.cast = this.peopleParser.parseCredits(credits);

        return content;
      }));
  }

  /**
   * Retrieves detailed information about someone
   * @param personId Person identifier for the MovieDB API
   */
  public getPersonDetails(personId: number, person?: Person): Observable<Person> {

    return this.http.get<MDBPersonJSON>(`${this.baseUrl}/person/${personId}?api_key=${this.apiKey}`)
      .pipe(withLatestFrom(this.imgBaseUrl$),
        map(([personJson, imgBaseUrl]) => this.peopleParser.parsePerson(personJson, imgBaseUrl, person)));
  }

  public getExtraImages(content: Content): Observable<string[]> {

    return this.http.get<MDBContentImagesJSON>(`${this.baseUrl}/${content.type}/${content.tmdbId}/images?api_key=${this.apiKey}`)
      .pipe(withLatestFrom(this.imgBaseUrl$),
        map(([contentImgJson, imgBaseUrl]) => this.contentParser.parseContentImages(contentImgJson, imgBaseUrl, content.backdrops))
      );
  }

  private parseContentList(response: MDBSearchResponseJSON, imgBaseUrl: string) {
    return response.results.map(res => this.contentParser.parse(res, imgBaseUrl));
  }

}
