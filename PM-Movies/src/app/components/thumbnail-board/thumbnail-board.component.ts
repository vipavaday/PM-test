import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  Subscription,
  zip
} from 'rxjs';

import {
  switchMap,
  map
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
export class ThumbnailBoardComponent implements OnInit, OnDestroy {

  private contents: Content[];
  public contentListStateSubscription: Subscription;

  constructor(
    private contentDataProvider: ContentFetcherService,
    contentListStateService: ContentListStateService,
    private filterManager: FilterManagerService
  ) {

    this.contentListStateSubscription = contentListStateService.queryUpdated$
      .pipe(switchMap(query => this.contentDataProvider.getContentInfo(query)))
      .subscribe(contents => this.contents = contents);

    this.filterManager.$filtersUpdated.pipe(
      map( filters => {
        return this.filterManager.filterContents(filters, this.contents);
      })
    ).subscribe(contents => this.contents = contents);
  }

  public ngOnInit() {
    this.contents = [];
  }

  public ngOnDestroy(): void {
    this.contentListStateSubscription.unsubscribe();
  }

  public getVisibleContents(): Content[] {
    return this.contents.filter(content => content.visible);
  }
}
