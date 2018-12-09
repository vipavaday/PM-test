import { Component, OnInit } from '@angular/core';

import { ContentDataService } from '../content-data.service';
import { Content } from '../content';

@Component({
  selector: 'app-thumbnail-board',
  templateUrl: './thumbnail-board.component.html',
  styleUrls: ['./thumbnail-board.component.scss']
})
export class ThumbnailBoardComponent implements OnInit {

  contents: Content[];

  constructor(private contentDataProvider: ContentDataService){}

  ngOnInit() {

    this.contentDataProvider.getPosterBaseUrl().subscribe( ()=>{

      this.contentDataProvider.searchInfoForContent('Clone Wars')
      .subscribe( contents => {
        this.contents = contents;
        console.log(this.contents);
      });
    });


  }

}
