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
    this.content.toWatch = !this.content.toWatch;
    this.storage.storeMarkedContent(this.content);
    event.preventDefault();
    event.stopPropagation();
  }

  public toggleWatchedContent(event: Event) {
    this.content.watched = !this.content.watched;
    this.storage.storeMarkedContent(this.content);
    event.preventDefault();
    event.stopPropagation();
  }
}
