import { Injectable } from '@angular/core';

import {
  Observable,
  of,
  forkJoin
} from 'rxjs';

import {
  map,
  switchMap
} from 'rxjs/operators';

import {
  Content,
  Cast,
  ContentType
} from '../../models';

import { MoviedbDataService } from '../moviedb-fetcher';
import { StorageService } from '../storage';
import { IContentFetcherService } from './content-fetcher.service.interface';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
@Injectable({
  providedIn: 'root'
})
export class ContentFetcherService implements IContentFetcherService {

  constructor(
    private contentFetcher: MoviedbDataService,
    private storage: StorageService) { }

  /**
  * Searches for content of any type matching the provided string (title)
  **/
  public getContentInfo(title: string): Observable<Content[]> {

    if (!title) {
      return of([]);
    }

    return this.contentFetcher.getContentInfo(title).pipe(map(contents => {
      return contents.map(content => this.checkStoredContent(content));
    }));
  }

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  public getContentDetails(type: ContentType, tmdbId: number): Observable<Content> {

    return this.contentFetcher.getContentDetails(type, tmdbId);
  }

  /**
   * Fetch details for the 10 most important casts of the specified content
   * @param content content for which we want to fetch casts details
   */
  public getCastDetails(content: Content): Observable<Cast[]> {
    if (!content) {
      throw new Error('#getCastDetails: content parameter should not be undefined');
    }

    return forkJoin(content.cast.slice(0, 10).map(cast => this.contentFetcher.getPersonDetails(cast.person.id, cast.person).pipe(
      switchMap(person => of(cast))
    )));
  }

  /**
   * Fetch backdrop images related to the provided content
   */
  public getExtraImages(content: Content): Observable<string[]> {
    return this.contentFetcher.getExtraImages(content);
  }

  private checkStoredContent(content: Content): Content {

    const storedContent: Content[] = this.storage.getStoredContents().filter(c => c.tmdbId === content.tmdbId);

    if (storedContent.length > 0) {
      content.toWatch = storedContent[0].toWatch;
      content.watched = storedContent[0].watched;
    }

    return content;
  }

}
