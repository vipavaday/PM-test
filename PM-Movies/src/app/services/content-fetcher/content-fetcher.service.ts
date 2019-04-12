import { Injectable } from '@angular/core';

import {
  Observable,
  of,
  forkJoin,
  merge
} from 'rxjs';

import { map, switchMap, scan } from 'rxjs/operators';

import {
  Content,
  Cast
} from '../../models';

import { MoviedbDataService } from '../moviedb-fetcher/moviedb-fetcher.service';
import { StorageService } from '../storage';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
@Injectable({
  providedIn: 'root'
})
export class ContentFetcherService {

  constructor(
    private contentFetcher: MoviedbDataService,
    private storage: StorageService) {}

  /**
  * Searches for content of any type matching the provided string (title)
  **/
  public getContentInfo(title: string): Observable<Content[]> {

    const savedContents: Content[] = this.storage.getStoredContents();
    return this.contentFetcher.getContentInfo(title).pipe(map(contents => {
      return contents.map(content => this.checkStoredContent(content));
    }));
  }

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  public getContentDetails(tmdbId: number, type: string ): Observable<Content> {

    return this.contentFetcher.getContentDetails(type, tmdbId);
  }

  /**
   * Fetch casts details for the specified content
   * @param content content for which we want to fetch casts details
   */
  public getCastDetails(content: Content): Observable<Cast[]> {

    return forkJoin(content.cast.map( eachCast => this.contentFetcher.getCastDetails(eachCast.id)));
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
