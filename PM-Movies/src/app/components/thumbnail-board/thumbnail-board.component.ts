import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  ContentFetcherService,
  ContentListStateService
 } from '../../services';

import {
  Content,
  Movie,
  TvShow,
  Filter
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

  public filtersPaneHidden = true;

  public contents: Content[];

  public querySubscription: Subscription;

  constructor(
    private contentDataProvider: ContentFetcherService,
    private queryService: ContentListStateService
  ) {

    this.querySubscription = queryService.queryUpdated$
      .pipe(switchMap(query => this.contentDataProvider.getContentInfo(query)))
      .subscribe(contents => this.contents = contents);
  }

  public ngOnInit() {

    this.contents = [];
  }

  public ngOnDestroy(): void {

    this.querySubscription.unsubscribe();
  }

  public toggleFiltersPane() {

    this.filtersPaneHidden = !this.filtersPaneHidden;
  }

  public onUpdateFilter(filter: Filter) {

    this.contents.forEach(content => content.visible = true);
    this.applyContentTypeFilters(filter);
    this.applyReleaseDateFilters(filter);
  }

  private applyReleaseDateFilters(filter: Filter) {
    this.contents.filter(content => content.releaseDate.getTime() < new Date(filter.gtReleaseDate).getTime())
      .map(content => content.visible = filter.showTvShows);
    this.contents.filter(content => content.releaseDate.getTime() > new Date(filter.ltReleaseDate).getTime())
      .map(content => content.visible = filter.showTvShows);
  }

  private applyContentTypeFilters(filter: Filter) {
    this.contents.filter(content => content instanceof Movie).map(content => content.visible = filter.showMovies);
    this.contents.filter(content => content instanceof TvShow).map(content => content.visible = filter.showTvShows);
  }
}
