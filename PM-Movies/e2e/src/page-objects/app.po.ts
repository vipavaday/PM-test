
import { $ } from 'protractor';

export class AppPage {
  public searchBar = $('.search-bar-input');
  public logo = $('.header-title-logo');
  public title = $('.header-title-link');

  public searchContentByKeyword(keyword: string) {
    this.searchBar.clear();
    this.searchBar.sendKeys(keyword);
  }
}
