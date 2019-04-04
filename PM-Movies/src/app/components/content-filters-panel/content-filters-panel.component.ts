import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

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

  @Output() public updateFilter: EventEmitter<Filter> = new EventEmitter();

  @Input() public hidden: boolean;

  public filter: Filter;

  constructor() {

    this.filter = new Filter();
  }

  public ngOnInit() {
    this.onUpdateFilter();
  }

  public updateGtDate(gtDate: string) {

    this.filter.gtReleaseDate = gtDate;
    this.onUpdateFilter();
  }

  public updateLtDate(ltDate: string) {

    this.filter.ltReleaseDate = ltDate;
    this.onUpdateFilter();
  }

  public toggleShowMovies() {

    this.filter.showMovies = !this.filter.showMovies;
    this.onUpdateFilter();
  }

  public toggleShowTvShows() {

    this.filter.showTvShows = !this.filter.showTvShows;
    this.onUpdateFilter();
  }

  public onUpdateFilter() {
    this.updateFilter.emit(this.filter);
  }

}
