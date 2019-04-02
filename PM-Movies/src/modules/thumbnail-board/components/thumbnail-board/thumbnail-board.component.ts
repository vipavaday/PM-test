import { Component, OnInit, Input } from '@angular/core';
import { Subscription }   from 'rxjs';

import { ContentDataService } from '../content-data.service';
import { Content } from '../content';
import { Movie } from '../movie';
import { TvShow } from '../tv-show';
import { Filter } from './content-filters-panel/filter';
import { QueryService } from './query.service';

/**
* Represents a set of content info thumbnails
**/
@Component({
  selector: 'app-thumbnail-board',
  templateUrl: './thumbnail-board.component.html',
  styleUrls: ['./thumbnail-board.component.scss']
})
export class ThumbnailBoardComponent implements OnInit {

  private _query: string = '';

  filtersPaneHidden: boolean = true;

  contents: Content[];

  subscription: Subscription;


  constructor(
    private contentDataProvider: ContentDataService,
    private queryService: QueryService
  ){

    this.subscription = queryService.queryUpdated$.subscribe(
      query => {
        this.query = query;
    });
  }

  ngOnInit() {

    this.contents = [];
  }

  @Input()
  set query(searchQuery: string){

    this._query = searchQuery;
    this.contents = [];

    this.contentDataProvider.getPosterBaseUrl().subscribe( ()=>{

      this.contentDataProvider.searchInfoForContent(this._query)
      .subscribe( contents => {
        this.contents = contents;
      });
    });
  }

  toggleFiltersPane(){

    this.filtersPaneHidden = !this.filtersPaneHidden;
  }

  onUpdateFilter(filter :Filter){

    this.contents.forEach( content => content.visible = true);

    for(let content of this.contents){

      if(!filter.showMovies){

        if(content instanceof Movie){
          content.visible = false;
        }
      }

      if(!filter.showTvShows){

        if(content instanceof TvShow){
          content.visible = false;
        }
      }

      if(filter.gtReleaseDate != ''){
        if(content.releaseDate.getTime() < new Date(filter.gtReleaseDate).getTime()){
          content.visible = false;
        }
      }

      if(filter.ltReleaseDate != ''){
        if(content.releaseDate.getTime() > new Date(filter.ltReleaseDate).getTime()){
          content.visible = false;
        }
      }
    }
  }

}
