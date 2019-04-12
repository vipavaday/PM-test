import {
  Component,
  Input
} from '@angular/core';

import {
  StorageService
} from '../../services';

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

  constructor(
    private storage: StorageService,
  ) { }

  public toggleWatchList(event: Event) {
    this.content.toWatch = !this.content.toWatch ;

    if (this.content.toWatch) {
      this.storage.addToWatchlist(this.content);
    } else {
      this.storage.removeFromWatchList(this.content);
    }

    event.stopPropagation();
  }

  public addToWatchedContents(event: Event) {

    this.content.watched = !this.content.watched;

    if (this.content.toWatch) {
      this.storage.addToWatchedContents(this.content);
    } else {
      this.storage.removeFromWatchedContents(this.content);
    }

    event.stopPropagation();
  }
}
