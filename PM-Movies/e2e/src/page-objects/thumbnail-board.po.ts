import { $, $$, browser } from 'protractor';

export class ThumbnailBoardPage {
  public rootEl = $('app-thumbnail-board');
  public emptyComponentEl = $('.thumbnail-board-empty-msg');
  public thumbnailsParentEl = $('.thumbnail-board-thumbnails');
  public thumbnails = $$('.content-thumbnail .card');
  public searchBar = $('.search-bar-input');

  public navigateTo() {
    return browser.get('/');
  }

  public searchContentByKeyword(keyword: string) {
    this.searchBar.clear();
    this.searchBar.sendKeys(keyword);
  }

  public hoverThumbnail(index: number) {
    browser.actions().mouseMove(this.thumbnails.get(index)).perform();
  }

  public toggleWatchedState(contentIndex: number) {
    this.thumbnails.get(contentIndex).$('.btn.watched').click();
  }

  public toggleToWatchState(contentIndex: number) {
    this.thumbnails.get(contentIndex).$('.btn.watched').click();
  }

  public clickDetailLink(contentIndex: number) {
    this.thumbnails.get(contentIndex).$('.card-body').click();
  }

  public isThumbnailPresent(contentTitle: string) {
    const filteredThumbnails = this.thumbnails.filter(thumbnail => thumbnail.$('.card-title').getText().then(tx => tx === contentTitle));
    return filteredThumbnails.count().then(res => res > 0);
  }
}
