import {
  Component,
  Input
} from '@angular/core';

import { ContentDataService } from '../../services';
import { Content } from '../../models';

/**
* Represents the main data about a content in a thumbnail
**/
@Component({
  selector: 'app-content-thumbnail',
  templateUrl: './content-thumbnail.component.html',
  styleUrls: ['./content-thumbnail.component.scss']
})
export class ContentThumbnailComponent {

  @Input() public content: Content;

  constructor(private dataService: ContentDataService) { }

  public addToWatchList() {
    this.content.toWatch = true;
    this.dataService.addToWatchList(this.content);
  }

  public removeFromWatchList() {
    this.content.toWatch = false;
    this.dataService.removeFromWatchList(this.content);
  }

  public addToSeenContent() {
    this.content.seen = true;
    this.dataService.addToSeenContent(this.content);
  }

  public removeFromSeenContent() {
    this.content.seen = false;
    this.dataService.removeFromSeenContent(this.content);
  }
}
