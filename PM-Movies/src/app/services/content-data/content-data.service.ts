import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs';
import { map, withLatestFrom, combineLatest, take, shareReplay } from 'rxjs/operators';

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
} from './content-data.service.interface';


/**
* Works out the number of days between two js Dates
**/
const daysBetween = function (date1: Date, date2: Date): number {

  const dayInMs = 1000 * 60 * 60 * 24;

  return Math.round(Math.abs(date1.getTime() - date2.getTime()) / dayInMs);

};

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
@Injectable({
  providedIn: 'root'
})
export class ContentDataService implements IContentDataService {

  private readonly apiKey = '?api_key=422113b1d8f5bb170e051db92b9e84b5';

  private readonly baseUrl: string = 'https://api.themoviedb.org/3';

  private imgBaseUrl$: Observable<string>;

  private lastConfigUpdate: Date;


  constructor(private http: HttpClient) {
    this.lastConfigUpdate = new Date();
    this.imgBaseUrl$ = this.http.get<Config>(`${this.baseUrl}/configuration${this.apiKey}`)
      .pipe(
        map(config => `${config.images.base_url}/original/`),
        shareReplay(1)
      );
  }

  /**
  * Searches for content of any type matching the provided string (title)
  **/
  public searchInfoForContent(title: string): Observable<Content[]> {
    if (title === '') {
      return of([]);
    }

    const search$ = this.http.get<MDBSearchResponseJSON>(`${this.baseUrl}/search/multi${this.apiKey}&query=${encodeURI(title)}`);

    return search$
      .pipe(
        withLatestFrom(this.imgBaseUrl$),
        map(([response, imgBaseUrl]) => {
          return response.results
            .filter(res => res.media_type === 'movie' || res.media_type === 'tv')
            .map(res => {

              const content: Content = this.parseContent(res, imgBaseUrl);
              this.getContentDuration(content).subscribe(duration => content.duration = duration);

              return content;
            });
        }));
  }

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  public getContentDetail(type: string, id: string): Observable<Content> {
    return this.http.get(this.baseUrl + '/' + type + '/' + id + this.apiKey)
      .pipe(
        withLatestFrom(this.imgBaseUrl$),
        map(([response, imgBaseUrl]: [any, string]) => {

          let content: Content;

          if (type === 'movie') {

            content = new Movie(
              response['original_title'],
              0,
              new Date((response['release_date'] === '') ? new Date(800, 12) : response['release_date'])
            );

          } else if (type === 'tv') {

            content = new TvShow(
              response['name'],
              0,
              new Date((response['first_air_date'] === '') ? new Date(800, 12) : response['first_air_date'])
            );
          }

          content.tmdbId = response['id'];
          content.posterUrl = imgBaseUrl + response['poster_path'];
          content._vote_average = response['vote_average'];
          content.duration = this.extractDuration(response);

          return content;

        }));
  }

  /**
  *  Retrieves the runtime of a movie or the average runtime of the episodes of a tv show
  */
  public getContentDuration(content: Content): Observable<number> {

    return this.http.get(this.baseUrl + content.getDetailsRoute() + this.apiKey)
      .pipe(map((data: any) => this.extractDuration(data)));
  }

  /**
  * Retrieves the cast of the movie or TV Show
  **/
  public getContentCast(content: Content): Observable<Cast[]> {

    return this.http.get(this.baseUrl + content.getDetailsRoute() + '/credits' + this.apiKey)
      .pipe(map(data => {

        return data['cast'].map(castObj => {

          const cast: Cast = new Cast();
          cast.cast_id = castObj['cast_id'];
          cast.character = castObj['character'];
          cast.gender = castObj['gender'];
          cast.name = castObj['name'];

          return cast;
        });

      }));
  }

  /**
  * Retrieves the director of a movie or Tv Show
  */
  public getDirector(content: Content): Observable<string> {

    return this.http.get(this.baseUrl + content.getDetailsRoute() + '/credits' + this.apiKey)
      .pipe(map(data => {
        const dir = data['crew'].filter(crewMember => crewMember['job'] === 'Director');
        return (dir.length > 0) ? dir[0]['name'] : 'Unknown';

      }));
  }

  /**
  * Checks in the localStorage whether the content has been marked as seen
  */
  public isSeen(content: Content): boolean {

    return localStorage.getItem(content.tmdbId + '_seen') === 'true';
  }

  /**
  * Checks in the localStorage whether the content is to be watched
  */
  public isToWatch(content: Content): boolean {

    return localStorage.getItem(content.tmdbId + '_watch') === 'true';
  }

  /**
  * If not already there, adds a content to watch in the localStorage
  */
  public addToWatchList(content: Content) {

    if (!localStorage.getItem(content.tmdbId + '_watch')) {
      localStorage.setItem(content.tmdbId + '_watch', 'true');
    }
  }

  /**
  * If exists, removes a content to watch from the localStorage
  */
  public removeFromWatchList(content: Content) {

    if (!localStorage.getItem(content.tmdbId + '_watch')) {
      localStorage.removeItem(content.tmdbId + '_watch');
    }
  }

  /**
  * If not already there, adds a content to see in the localStorage
  */
  public addToSeenContent(content: Content) {

    if (!localStorage.getItem(content.tmdbId + '_seen')) {
      localStorage.setItem(content.tmdbId + '_seen', 'true');
    }
  }

  /**
  * If exists, removes a content to see from the localStorage
  */
  public removeFromSeenContent(content: Content) {

    if (!localStorage.getItem(content.tmdbId + '_seen')) {
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
    content: MDBSearchResultMovieJSON | MDBSearchResultTvShowJSON | MDBSearchResultPersonJSON,
    imgBaseUrl: string
  ): Content {

    let parsedContent: Content;

    if (content.media_type === 'person') {
      return;
    }

    if (content.media_type === 'movie') {
      parsedContent = new Movie(content.original_title, 0, this.parseDate(content.release_date));
    } else if (content.media_type === 'tv') {
      parsedContent = new TvShow(content.name, 0, this.parseDate(content.first_air_date));
    }

    parsedContent.tmdbId = content.id;
    parsedContent.posterUrl = imgBaseUrl + content.poster_path;
    parsedContent._seen = this.isSeen(parsedContent);
    parsedContent._toWatch = this.isToWatch(parsedContent);

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
