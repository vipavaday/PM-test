import { Component, OnInit, Input } from '@angular/core';

import { Content } from '../../content';
import { ContentDataService } from '../../content-data.service';

@Component({
  selector: 'app-content-thumbnail',
  templateUrl: './content-thumbnail.component.html',
  styleUrls: ['./content-thumbnail.component.scss']
})
export class ContentThumbnailComponent implements OnInit {

  @Input() content: Content;

  constructor(private dataService: ContentDataService) { }

  ngOnInit() {

  }

  addToWatchList(){
    this.content._toWatch = true;
    this.dataService.addToWatchList(this.content);
  }

  removeFromWatchList(){
    this.content._toWatch = false;
    this.dataService.removeFromWatchList(this.content);
  }

  addToSeenContent(){
    this.content._seen = true;
    this.dataService.addToSeenContent(this.content);
  }

  removeFromSeenContent(){
    this.content._seen = false;
    this.dataService.removeFromSeenContent(this.content);
  }

}
