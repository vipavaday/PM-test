import { $, ElementFinder, protractor } from 'protractor';

export class FiltersPanelPage {
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

  public async enableMovieFilter(): Promise<void> {
    const checked = await this.toggleMovieEl.isSelected();
    if (!checked) {
      this.toggleMovieEl.click();
    }
  }

  public async disableMovieFilter() {
    const checked = await this.toggleMovieEl.isSelected();
    if (!!checked) {
      this.toggleMovieEl.click();
    }
  }

  public async enableTvShowFilter(): Promise<void> {
    const checked = await this.toggleTvShowEl.isSelected();
    if (!checked) {
      this.toggleTvShowEl.click();
    }
  }

  public async disableTvShowFilter() {
    const checked = await this.toggleTvShowEl.isSelected();
    if (!!checked) {
      this.toggleTvShowEl.click();
    }
  }

  /**
   * Type date in After filter
   * @param date mm/dd/yyyy format
   */
  public filterByGtDate(date: string) {
    this.clearDate(this.gtDateEl).then(() => this.gtDateEl.sendKeys(date));
  }

  /**
   * Type date in Before filter
   * @param date mm/dd/yyyy format
   */
  public filterByLtDate(date: string) {
    this.clearDate(this.ltDateEl).then(() => this.ltDateEl.sendKeys(date));
  }

  public clearDate(el: ElementFinder) {
    return el.getAttribute('value').then(val => {
      const length = val.length;
      let backspaceSeries = '';

      for (let i = 0; i < length; ++i) {
        backspaceSeries += protractor.Key.BACK_SPACE;
      }
      el.sendKeys(backspaceSeries);
      return true;
    });
  }
}
