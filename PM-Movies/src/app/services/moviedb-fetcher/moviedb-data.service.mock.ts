import { Injectable } from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';

import {
  Content,
  Person,
  ContentType
} from '../../models';

import { IMoviedbDataService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class MoviedbDataServiceMock implements IMoviedbDataService {

  public getContentInfo(title: string): Observable<Content[]> {
    return of([]);
  }

  public getContentDetails(type: ContentType, id: number): Observable<Content> {
    return of(new Content());
  }

  public getPersonDetails(personId: number, person?: Person): Observable<Person> {
    return of(new Person());
  }

  public getExtraImages(content: Content): Observable<string[]> {
    return of([]);
  }
}
