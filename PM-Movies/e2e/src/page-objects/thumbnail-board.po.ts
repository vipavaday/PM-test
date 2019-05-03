import { $, $$, browser } from 'protractor';

export class ThumbnailBoardPage {
  public rootEl = $('app-thumbnail-board');
  public emptyComponentEl = $('.thumbnail-board-empty-msg');
  public thumbnailsParentEl = $('.thumbnail-board-thumbnails');
  public thumbnails = $$('.content-thumbnail');
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

  public isContentWatched(index: number) {
    return this.thumbnails.get(index).$('.btn.watched.btn-primary').isPresent();
  }

  public isContentToWatch(index: number) {
    return this.thumbnails.get(index).$('.btn.to-watch.btn-primary').isPresent();
  }

  public toggleWatchedState(contentIndex: number) {
    this.hoverThumbnail(contentIndex);
    this.thumbnails.get(contentIndex).$('.btn.watched').click();
  }

  public toggleToWatchState(contentIndex: number) {
    this.hoverThumbnail(contentIndex);
    this.thumbnails.get(contentIndex).$('.btn.to-watch').click();
  }

  public clickDetailLink(contentIndex: number) {
    $$('.content-thumbnail .card').get(contentIndex).$('.card-body').click();
  }

  public async isThumbnailPresent(contentTitle: string) {
    const filteredThumbnails = this.thumbnails.filter(thumbnail => thumbnail.$('.card-title').getText().then(tx => tx === contentTitle));
    const res = await filteredThumbnails.count();
    return res > 0;
  }
}
