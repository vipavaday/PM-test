import { Injectable } from '@angular/core';

import { IContentListStateService } from './content-list-state.service.interface';

/**
* Enables the search bar to notify the ThumbnailBoard component when the search
* query is updated in order to refresh the displayed results
**/
@Injectable({
  providedIn: 'root'
})
export class ContentListStateServiceMock implements IContentListStateService {

  public updateQuery(query: string): void {
  }
}

