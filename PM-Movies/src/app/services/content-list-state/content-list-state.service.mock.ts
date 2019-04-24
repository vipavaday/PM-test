import { Injectable } from '@angular/core';

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
export class ContentListStateServiceMock implements IContentListStateService {

  public queryUpdatedSource = new BehaviorSubject<string>('');
  public queryUpdated$ = this.queryUpdatedSource.asObservable().pipe(debounceTime(300));

  public updateQuery(query: string): void {
  }
}

