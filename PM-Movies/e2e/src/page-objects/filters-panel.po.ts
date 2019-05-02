import { $, $$, browser } from 'protractor';

export class FilterSPanelPage {
  public rootEl = $('.filters-panel');
  public gtDateEl = $('.gt-release-date');
  public ltDateEl = $('.lt-release-date');
  public toggleMovieEl = $('.toggle-movie-filter-input');
  public toggleTvShowEl = $('.toggle-tvshow-filter-input');

  public collapseFiltersPanel() {
    $('.filters-panel-header-icon.close-icon').click();
  }

  public expandFiltersPanel() {
    $('.filters-panel-header-icon.tab-icon').click();
  }

  public toggleMovieFilter(): void {
    this.toggleMovieEl.click();
  }

  public toggleTvShowFilter(): void {
    this.toggleTvShowEl.click();
  }

  public filterByGtDate(date: string) {
    this.gtDateEl.clear();
    this.gtDateEl.sendKeys(date);
  }

  public filterByLtDate(date: string) {
    this.ltDateEl.clear();
    this.ltDateEl.sendKeys(date);
  }
}
