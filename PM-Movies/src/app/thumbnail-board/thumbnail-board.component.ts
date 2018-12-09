import { Component, OnInit, Input } from '@angular/core';

import { ContentDataService } from '../content-data.service';
import { Content } from '../content';

@Component({
  selector: 'app-thumbnail-board',
  templateUrl: './thumbnail-board.component.html',
  styleUrls: ['./thumbnail-board.component.scss']
})
export class ThumbnailBoardComponent implements OnInit {

  private _query: string = '';

  contents: Content[];


  constructor(private contentDataProvider: ContentDataService){}

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

}
