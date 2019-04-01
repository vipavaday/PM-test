import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
* Enables the search bar to notify the ThumbnailBoard component when the search
* query is updated in order to refresh the displayed results
**/
@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private queryUpdatedSource = new Subject<string>();

  queryUpdated$ = this.queryUpdatedSource.asObservable();

  updateQuery(query: string) {

    this.queryUpdatedSource.next(query);
  }

  constructor() { }
}
