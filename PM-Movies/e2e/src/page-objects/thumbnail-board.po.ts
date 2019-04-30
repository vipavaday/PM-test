import { $, $$, browser } from 'protractor';

export class ThumbnailBoardPage {
  public rootEl = $('app-thumbnail-board');
  public filterPanelEl = $('.filters-panel');
  public emptyComponentEl = $('.thumbnail-board-empty-msg');
  public gtDateEl = $('.gt-release-date');
  public ltDateEl = $('.lt-release-date');
  public toggleMovieEl = $('.toggle-movie-filter-input');
  public toggleTvShowEl = $('.toggle-tvshow-filter-input');
  public thumbnailsParentEl = $('.thumbnail-board-thumbnails');
  public thumbnails = $$('.content-thumbnail .card');

  public navigateTo() {
    return browser.get('/');
  }

  public searchContentByKeyword(keyword: string) {
    $('.search-bar-input').clear();
    $('.search-bar-input').sendKeys(keyword);
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

  public collapseFiltersPanel() {
    $('.filters-panel-header-icon.close-icon').click();
  }

  public expandFiltersPanel() {
    $('.filters-panel-header-icon.tab-icon').click();
  }
}
