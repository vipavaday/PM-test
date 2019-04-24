import { Injectable } from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';

import {
  Content,
  Cast,
  ContentType
} from '../../models';

import { IContentFetcherService } from './content-fetcher.service.interface';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
@Injectable({
  providedIn: 'root'
})
export class ContentFetcherServiceMock implements IContentFetcherService {

  public getContentInfo(title: string): Observable<Content[]> {
    return of([]);
  }

  public getContentDetails(type: ContentType, tmdbId: number): Observable<Content> {

    return of(new Content());
  }

  public getCastDetails(content: Content): Observable<Cast[]> {
    return of([]);
  }

  public getExtraImages(content: Content): Observable<string[]> {
    return of([]);
  }
}
