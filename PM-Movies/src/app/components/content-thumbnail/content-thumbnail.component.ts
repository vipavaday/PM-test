import {
  Component,
  Input
} from '@angular/core';

import {
  ContentFetcherService,
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
    private dataService: ContentFetcherService,
    private storage: StorageService,
  ) { }

  public addToWatchList() {
    this.content.toWatch = true;
    this.storage.addToWatchlist(this.content);
  }

  public removeFromWatchList() {
    this.content.toWatch = false;
    this.storage.removeFromWatchList(this.content);
  }

  public addToWatchedContents() {
    this.content.watched = true;
    this.storage.addToWatchedContents(this.content);
  }

  public removeFromWatchedContents() {
    this.content.watched = false;
    this.storage.removeFromWatchedContents(this.content);
  }
}
