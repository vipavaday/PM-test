import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Filter } from './filter';

@Component({
  selector: 'app-content-filters-panel',
  templateUrl: './content-filters-panel.component.html',
  styleUrls: ['./content-filters-panel.component.scss']
})
export class ContentFiltersPanelComponent implements OnInit {

  @Output() updateFilter: EventEmitter<Filter> = new EventEmitter();

  @Input() hidden:boolean;

  filter:Filter;

  constructor() {

    this.filter = new Filter();
  }

  ngOnInit() {
    this.onUpdateFilter();
  }

  updateGtDate(gtDate: string){

    this.filter.gtReleaseDate = gtDate;
    this.onUpdateFilter();
  }

  updateLtDate(ltDate: string){

    this.filter.ltReleaseDate = ltDate;
    this.onUpdateFilter();
  }

  toggleShowMovies(){

    this.filter.showMovies = ! this.filter.showMovies;
    this.onUpdateFilter();
  }

  toggleShowTvShows(){

    this.filter.showTvShows = ! this.filter.showTvShows;
    this.onUpdateFilter();
  }

  onUpdateFilter(){
    this.updateFilter.emit(this.filter);
  }

}
