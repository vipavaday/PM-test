import {
  Component,
  OnDestroy,
} from '@angular/core';

import {
  Subscription,
} from 'rxjs';

import {
  map,
  switchMap
} from 'rxjs/operators';

import {
  ContentFetcherService,
  ContentListStateService,
  FilterManagerService
} from '../../services';

import {
  Content
} from '../../models';

/**
* Represents a set of content info thumbnails
**/
@Component({
  selector: 'app-thumbnail-board',
  templateUrl: './thumbnail-board.component.html',
  styleUrls: ['./thumbnail-board.component.scss']
})
export class ThumbnailBoardComponent implements OnDestroy {

  public contents: Content[] = [];
  public contentListStateSubscription: Subscription;

  constructor(
    private contentDataProvider: ContentFetcherService,
    contentListStateService: ContentListStateService,
    private filterManager: FilterManagerService
  ) {

    this.contentListStateSubscription = contentListStateService.queryUpdated$.pipe(
      switchMap(query => this.contentDataProvider.getContentInfo(query)),
      map(contents => this.filterManager.filterContents(contents))
    ).subscribe(contents => this.contents = contents);

    this.filterManager.$filtersUpdated.subscribe(() => {
      this.contents = this.filterManager.filterContents(this.contents);
    });
  }

  public ngOnDestroy(): void {
    this.contentListStateSubscription.unsubscribe();
  }

  public getVisibleContents(): Content[] {
    return this.contents.filter(content => content.visible);
  }
}
