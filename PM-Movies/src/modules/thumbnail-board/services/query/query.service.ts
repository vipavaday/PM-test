import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
* Enables the search bar to notify the ThumbnailBoard component when the search
* query is updated in order to refresh the displayed results
**/
@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private queryUpdatedSource = new Subject<string>();

  queryUpdated$ = this.queryUpdatedSource.asObservable()
    .pipe(debounceTime(200));

  public updateQuery(query: string) {

    this.queryUpdatedSource.next(query);
  }

  constructor() { }
}
