import {
  $,
  browser
} from 'protractor';
import { ContentType } from '../../../src/app/models';

export class ContentDetailPage {
  public rootEl = $('.detail-container');

  public navigateTo(contentType: ContentType, contentId: string) {
    browser.get(`/detail/${contentType}/${contentId}`);
  }
}
