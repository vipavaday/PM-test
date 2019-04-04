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

import { Cast } from '../../../app/models';

import {
  Content,
  Movie,
  TvShow,
  Config,
} from '../../models';

import {
  IContentDataService,
  MDBSearchResponseJSON,
  MDBSearchResultMovieJSON,
  MDBSearchResultTvShowJSON,
  MDBSearchResultPersonJSON,
  MDBMovieDetailsResponseJSON,
  MDBTvShowDetailsResponseJSON,
  MDBCreditsResponseJSON,
} from './content-data.service.interface';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
@Injectable({
  providedIn: 'root'
})
export class ContentDataService implements IContentDataService {

  private readonly apiKey = '422113b1d8f5bb170e051db92b9e84b5';

  private readonly baseUrl: string = 'https://api.themoviedb.org/3';

  private imgBaseUrl$: Observable<string>;

  constructor(private http: HttpClient) {

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

  private parseDetails(
    contentDetail: MDBTvShowDetailsResponseJSON | MDBMovieDetailsResponseJSON,
    credits: MDBCreditsResponseJSON,
    imgBaseUrl: string,
    type: string): Content {

    if (type === 'tv') {
      return this.parseTvShowDetails(<MDBTvShowDetailsResponseJSON>contentDetail, credits, imgBaseUrl);
    }

    if (type === 'movie') {
      return this.parseMovieDetails(<MDBMovieDetailsResponseJSON>contentDetail, credits, imgBaseUrl);
    }
  }

  private parseTvShowDetails(contentDetail: MDBTvShowDetailsResponseJSON, credits: MDBCreditsResponseJSON, imgBaseUrl: string): Content {

    const content: Content = new TvShow(
      contentDetail.name,
      0,
      this.parseDate(contentDetail.first_air_date)
    );

    content.tmdbId = contentDetail.id;
    content.posterUrl = (!!contentDetail.poster_path) ? imgBaseUrl + contentDetail.poster_path : null;
    content.vote_average = contentDetail.vote_average;
    content.duration = this.extractDuration(contentDetail);
    content.cast = this.getCasts(credits);

    const directors = credits.crew.filter(crewMember => crewMember.job === 'Director');
    content.director = (directors.length > 0) ? directors[0].name : 'Unknown';

    return content;
  }

  private parseMovieDetails(contentDetail: MDBMovieDetailsResponseJSON, credits: MDBCreditsResponseJSON, imgBaseUrl: string): Content {

    const content: Content = new Movie(
      contentDetail.original_title,
      0,
      this.parseDate(contentDetail.release_date)
    );

    content.tmdbId = contentDetail.id;
    content.posterUrl = (!!contentDetail.poster_path) ? imgBaseUrl + contentDetail.poster_path : null;
    content.vote_average = contentDetail.vote_average;
    content.duration = this.extractDuration(contentDetail);
    content.cast = this.getCasts(credits);

    const directors = credits.crew.filter(crewMember => crewMember.job === 'Director');
    content.director = (directors.length > 0) ? directors[0].name : 'Unknown';

    return content;
  }

  private getCasts(credits: MDBCreditsResponseJSON): Cast[] {
    return credits.cast.map(castJSON => {
      const cast: Cast = new Cast();
      cast.cast_id = castJSON.cast_id;
      cast.character = castJSON.character;
      cast.gender = castJSON.gender;
      cast.name = castJSON.name;
      return cast;
    });
  }

  /**
  * Checks in the localStorage whether the content has been marked as seen
  */
  public isSeen(tmdbId: number): boolean {

    return localStorage.getItem(`${tmdbId}_seen`) === 'true';
  }

  /**
  * Checks in the localStorage whether the content is to be watched
  */
  public isToWatch(tmdbId: number): boolean {

    return localStorage.getItem(`${tmdbId}_watch'`) === 'true';
  }

  /**
  * If not already there, adds a content to watch in the localStorage
  */
  public addToWatchList(content: Content): void {

    if (!localStorage.getItem(content.tmdbId + '_watch')) { } {
      localStorage.setItem(content.tmdbId + '_watch', 'true');
    }
  }

  /**
  * If exists, removes a content to watch from the localStorage
  */
  public removeFromWatchList(content: Content): void {

    if (!localStorage.getItem(content.tmdbId + '_watch')) { } {
      localStorage.removeItem(content.tmdbId + '_watch');
    }
  }

  /**
  * If not already there, adds a content to see in the localStorage
  */
  public addToSeenContent(content: Content): void {

    if (!localStorage.getItem(content.tmdbId + '_seen')) { } {
      localStorage.setItem(content.tmdbId + '_seen', 'true');
    }
  }

  /**
  * If exists, removes a content to see from the localStorage
  */
  public removeFromSeenContent(content: Content): void {

    if (!localStorage.getItem(content.tmdbId + '_seen')) { } {
      localStorage.removeItem(content.tmdbId + '_seen');
    }
  }

  private extractDuration(data: { runtime: number } | { episode_run_time: number[] }): number {

    if (Array.isArray(data['episode_run_time'])) {
      return Math.round(data['episode_run_time']
        .reduce((a, b) => a + b, 0) / data['episode_run_time'].length);
    }

    if (typeof data['runtime'] === 'number') {
      return data['runtime'];
    }
  }

  private parseContent(
    content: MDBSearchResultMovieJSON | MDBSearchResultTvShowJSON,
    imgBaseUrl: string
  ): Content {

    let parsedContent: Content;

    if (content.media_type === 'movie') {
      parsedContent = new Movie(content.original_title, 0, this.parseDate(content.release_date));
    } else if (content.media_type === 'tv') {
      parsedContent = new TvShow(content.name, 0, this.parseDate(content.first_air_date));
    }

    parsedContent.tmdbId = content.id;
    parsedContent.posterUrl = (!!content.poster_path) ? imgBaseUrl + content.poster_path : null;
    parsedContent.seen = this.isSeen(content.id);
    parsedContent.toWatch = this.isToWatch(content.id);
    parsedContent.vote_average = content.vote_average;

    return parsedContent;
  }

  private parseDate(date: string): Date {

    const dateN = Date.parse(date);

    if (isNaN(dateN)) {
      return null;
    }

    return new Date(dateN);
  }
}
