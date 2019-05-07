import { $, $$, browser, promise } from 'protractor';

export class ThumbnailBoardPage {
  public rootEl = $('app-thumbnail-board');
  public emptyComponentEl = $('.thumbnail-board-empty-msg');
  public thumbnailsParentEl = $('.thumbnail-board-thumbnails');
  public thumbnails = $$('.content-thumbnail');

  public async navigateTo(): promise.Promise<void> {
    return browser.get('/');
  }

  public async hoverThumbnail(index: number): promise.Promise<void> {
    return browser.actions().mouseMove(this.thumbnails.get(index)).perform();
  }

  public async isContentWatched(index: number): promise.Promise<boolean> {
    return this.thumbnails.get(index).$('.btn.watched.btn-primary').isPresent();
  }

  public async isContentToWatch(index: number): promise.Promise<boolean> {
    return this.thumbnails.get(index).$('.btn.to-watch.btn-primary').isPresent();
  }

  public async toggleWatchedState(contentIndex: number): promise.Promise<void> {
    this.hoverThumbnail(contentIndex);
    return this.thumbnails.get(contentIndex).$('.btn.watched').click();
  }

  public async toggleToWatchState(contentIndex: number): promise.Promise<void> {
    this.hoverThumbnail(contentIndex);
    return this.thumbnails.get(contentIndex).$('.btn.to-watch').click();
  }

  public async clickDetailLink(contentIndex: number): promise.Promise<void> {
    return $$('.content-thumbnail .card').get(contentIndex).$('.card-body').click();
  }

  public async isThumbnailPresent(contentTitle: string): promise.Promise<boolean> {
    const value = await this.thumbnails.filter(async thumbnail => {
      const tx = await thumbnail.$('.card-title').getText();
      return tx === contentTitle;
    });
    return value.length > 0;
  }

  public async isThumbnailsLoaded(): promise.Promise<boolean> {
    const nb = await this.thumbnails.count();
    return nb > 0;
  }
}
