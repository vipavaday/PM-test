import {
  Component,
  OnInit
} from '@angular/core';

import { FilterManagerService } from 'src/app/services';
import { Filter } from '../../models/filter/filter';

/**
* Represents a filter panel that permits daterange-based and content type filtering
**/
@Component({
  selector: 'app-content-filters-panel',
  templateUrl: './content-filters-panel.component.html',
  styleUrls: ['./content-filters-panel.component.scss']
})
export class ContentFiltersPanelComponent implements OnInit {

  public hidden: boolean;
  public filter: Filter;
  public readonly absoluteMinReleaseDate: Date;

  constructor(private filterManager: FilterManagerService) {
    this.filter = new Filter();
    this.absoluteMinReleaseDate = new Date('1850-01-01');
  }

  public ngOnInit() {
    this.filter = this.filterManager.filtersUpdateSource.getValue();
  }

  public toggleMovieFilter() {
    this.filter.toggleContentType('movie');
    this.onUpdateFilter();
  }

  public toggleTvshowFilter() {

    this.filter.toggleContentType('tv');
    this.onUpdateFilter();
  }

  public getMinLtDate(): Date {
    return (!!this.filter.gtReleaseDate) ? new Date(this.filter.gtReleaseDate) : this.absoluteMinReleaseDate;
  }

  public getTodayDate(): Date {
    return new Date();
  }

  public getMaxGtDate(): Date {
    return (!!this.filter.ltReleaseDate) ? new Date(this.filter.ltReleaseDate) : new Date();
  }

  public onUpdateFilter() {
    this.filterManager.filtersUpdateSource.next(this.filter);
  }
}
