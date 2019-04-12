import {
  Component,
  OnInit
} from '@angular/core';

import { Filter } from '../../models/filter/filter';
import { FilterManagerService } from 'src/app/services';

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

  constructor(private filterManager: FilterManagerService) {

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

    this.filter.toggleContentType('movie');
    this.onUpdateFilter();
  }

  public toggleShowTvShows() {

    this.filter.toggleContentType('tv');
    this.onUpdateFilter();
  }

  public onUpdateFilter() {
    this.filterManager.filtersUpdateSource.next(this.filter);
  }
}
