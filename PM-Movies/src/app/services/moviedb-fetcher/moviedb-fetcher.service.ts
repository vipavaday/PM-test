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

import { Cast } from '../../models';

import {
  Content,
  Movie,
  TvShow,
  Config,
} from '../../models';

import { IContentFetcherService } from '../content-fetcher/content-fetcher.service.interface';
import { StorageService } from '../storage';

import {
  MDBSearchResponseJSON,
  MDBSearchResultMovieJSON,
  MDBSearchResultTvShowJSON,
  MDBSearchResultPersonJSON,
  MDBMovieDetailsResponseJSON,
  MDBTvShowDetailsResponseJSON,
  MDBCreditsResponseJSON
} from '../content-parser';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
@Injectable({
  providedIn: 'root'
})
export class MoviedbDataService implements IContentFetcherService {

  private readonly apiKey = '422113b1d8f5bb170e051db92b9e84b5';

  private readonly baseUrl: string = 'https://api.themoviedb.org/3';

  private imgBaseUrl$: Observable<string>;

  constructor(
    private http: HttpClient,
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

    return search$
      .pipe(
        withLatestFrom(this.imgBaseUrl$),
        map(([response, imgBaseUrl]) => {
          return response.results
            .filter(this.excludePerson)
            .map((res: MDBSearchResultMovieJSON | MDBSearchResultTvShowJSON) => this.parseContent(res, imgBaseUrl));
        }));
  }

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  public getContentDetails(type: string, id: string): Observable<Content> {

    const credits$ = this.http.get<MDBCreditsResponseJSON>(`${this.baseUrl}/${type}/${id}/credits?api_key=${this.apiKey}`);
    const details$ = this.http.get(`${this.baseUrl}/${type}/${id}?api_key=${this.apiKey}`);

    return zip(details$, credits$).pipe(
      withLatestFrom(this.imgBaseUrl$),
      map(([[contentDetail, credits], imgBaseUrl]: [[MDBTvShowDetailsResponseJSON, MDBCreditsResponseJSON], string]) => {
        return this.parseDetails(contentDetail, credits, imgBaseUrl, type);
      }));

  }

  private excludePerson(
    result: MDBSearchResultMovieJSON | MDBSearchResultTvShowJSON | MDBSearchResultPersonJSON
  ): result is (MDBSearchResultMovieJSON | MDBSearchResultTvShowJSON) {
    return result.media_type === 'movie' || result.media_type === 'tv';
  }
}
