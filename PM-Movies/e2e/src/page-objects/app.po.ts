
import {
  $,
  browser
} from 'protractor';
import { ContentType } from '../../../src/app/models';

export class AppPage {
  public searchBar = $('.search-bar-input');

  public searchContentByKeyword(keyword: string) {
    this.searchBar.clear();
    this.searchBar.sendKeys(keyword);
  }
}
