import {
  browser,
  ExpectedConditions
} from 'protractor';

import { AppPage } from '../page-objects/app.po';
import { ContentDetailPage } from '../page-objects/content-detail.po';
import { ThumbnailBoardPage } from '../page-objects/thumbnail-board.po';

describe('Content details', () => {
  let appPage: AppPage;
  let thumbnailBoardPage: ThumbnailBoardPage;
  let contentDetailPage: ContentDetailPage;

  beforeAll(() => {
    appPage = new AppPage();
    thumbnailBoardPage = new ThumbnailBoardPage();
    contentDetailPage = new ContentDetailPage();
    contentDetailPage.navigateTo('movie', '2639');
  });

  describe('render page : ', () => {
    it('should display content details page', () => {
      expect(contentDetailPage.rootEl.isDisplayed()).toBe(true);
    });
  });

  describe('redirection from content detail page :', () => {
    afterAll(() => {
      thumbnailBoardPage.navigateTo();
    });

    describe('when user types a keyword in the searchbar', () => {
      beforeAll(() => {
        appPage.searchContentByKeyword('star wars');
      });

      afterAll(() => {
        contentDetailPage.navigateTo('movie', '2639');
      });

      it('should redirect to thumbnail board page ', () => {
        expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
      });

      it('should display previous search result', () => {
        expect(thumbnailBoardPage.thumbnails.count()).not.toBe(0);
      });

      it('should display previous search keywords in searchbar', () => {
        browser.wait(ExpectedConditions.presenceOf(appPage.searchBar));
        expect(appPage.searchBar.getAttribute('value')).toEqual('star wars');
      });
    });

    it('should redirect user to search page when app logo is clicked', () => {
      appPage.logo.click();
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.rootEl));
      expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
      contentDetailPage.navigateTo('movie', '2639');
    });

    it('should redirect user to search page when app title is clicked', () => {
      appPage.title.click();
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.rootEl));
      expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
      contentDetailPage.navigateTo('movie', '2639');
    });
  });
});
