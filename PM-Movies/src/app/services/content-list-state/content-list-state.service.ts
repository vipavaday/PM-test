import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IContentListStateService } from './content-list-state.service.interface';

/**
* Enables the search bar to notify the ThumbnailBoard component when the search
* query is updated in order to refresh the displayed results
**/
@Injectable({
  providedIn: 'root'
})
export class ContentListStateService implements IContentListStateService {

  public queryUpdatedSource = new BehaviorSubject<string>('');
  public queryUpdated$ = this.queryUpdatedSource.asObservable().pipe(debounceTime(300));

  private lastSearch: string;

  constructor(private router: Router) { }

  public updateQuery(query: string) {

    this.router.navigate(['/thumbnail-board']);
    this.queryUpdatedSource.next(query);
    this.lastSearch = query;
  }
}
