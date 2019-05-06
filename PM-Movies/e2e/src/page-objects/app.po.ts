
import {
  $,
  ElementFinder,
  promise,
  protractor
} from 'protractor';

export class AppPage {
  public searchBar = $('.search-bar-input');

  public static clearInput(el: ElementFinder): promise.Promise<void> {
    return el.getAttribute('value').then(val => {
      const length = val.length;
      let backspaceSeries = '';

      for (let i = 0; i < length; ++i) {
        backspaceSeries += protractor.Key.BACK_SPACE;
      }

      return el.sendKeys(backspaceSeries);
    });
  }

  public searchContentByKeyword(keyword: string) {
    this.searchBar.clear();
    this.searchBar.sendKeys(keyword);
  }
}
