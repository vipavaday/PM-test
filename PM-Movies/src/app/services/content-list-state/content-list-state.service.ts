import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Filter } from '../../models';


/**
* Enables the search bar to notify the ThumbnailBoard component when the search
* query is updated in order to refresh the displayed results
**/
@Injectable({
  providedIn: 'root'
})
export class ContentListStateService {

  public queryUpdatedSource = new ReplaySubject<string>();
  public queryUpdated$ = this.queryUpdatedSource.asObservable().pipe(debounceTime(300));

  public filterUpdateSource = new ReplaySubject<Filter>();

  private lastSearch: string;

  constructor(private router: Router) {}

  public updateQuery(query: string) {

    this.router.navigate(['/thumbnail-board']);
    this.queryUpdatedSource.next(query || this.lastSearch);
    this.lastSearch = query;
  }
}
