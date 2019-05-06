import {
  browser,
  ExpectedConditions
} from 'protractor';

import { AppPage } from '../page-objects/app.po';
import { ContentDetailPage } from '../page-objects/content-detail.po';
import { FiltersPanelPage } from '../page-objects/filters-panel.po';
import { ThumbnailBoardPage } from '../page-objects/thumbnail-board.po';

describe('Thumbnail board', () => {
  let appPage: AppPage;
  let thumbnailBoardPage: ThumbnailBoardPage;
  let filtersPanelPage: FiltersPanelPage;
  let contentDetailPage: ContentDetailPage;

  beforeAll(() => {
    appPage = new AppPage();
    thumbnailBoardPage = new ThumbnailBoardPage();
    filtersPanelPage = new FiltersPanelPage();
    contentDetailPage = new ContentDetailPage();
    thumbnailBoardPage.navigateTo();
  });

  describe('render page : ', () => {
    it('should display search page', () => {
      expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
    });
  });

  describe('filters panel : ', () => {
    describe('expanded by default', () => {
      it('should display expanded filter panel ', () => {
        expect(filtersPanelPage.rootEl.isDisplayed()).toBe(true);
      });

      it('should display focusable min date filter input', () => {
        expect(filtersPanelPage.gtDateEl.isDisplayed()).toBe(true);
      });

      it('should display focusable max date filter input', () => {
        expect(filtersPanelPage.ltDateEl.isDisplayed()).toBe(true);
      });

      it('should display focusable tv show filter input', () => {
        expect(filtersPanelPage.toggleTvShowEl.isDisplayed()).toBe(true);
      });

      it('should display focusable movie filter input', () => {
        expect(filtersPanelPage.toggleMovieEl.isDisplayed()).toBe(true);
      });
    });

    describe('collapsible behavior', () => {
      beforeAll(() => {
        appPage.searchContentByKeyword('star wars');
      });

      afterAll(() => {
        AppPage.clearInput(appPage.searchBar);
      });

      it('should display contents thumbnails aside from filter panel with no overlap', () => {
        browser.wait(ExpectedConditions.visibilityOf(filtersPanelPage.ltDateEl));
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.thumbnails.get(0).isDisplayed()).toBe(true);
      });

      it('should collapse filters panel when user clicks on close button', () => {
        filtersPanelPage.collapseFiltersPanel();
        expect(filtersPanelPage.gtDateEl.isPresent()).toBe(false);
        filtersPanelPage.expandFiltersPanel();
      });
    });
  });

  describe('content thumbnails :', () => {
    afterAll(() => {
      AppPage.clearInput(appPage.searchBar);
    });

    it('should display no thumbnails and a notification message', () => {
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.emptyComponentEl));
      expect(thumbnailBoardPage.emptyComponentEl.isDisplayed()).toBe(true);
    });

    it('should display search results when user types keywords in the searchbar', () => {
      appPage.searchContentByKeyword('star wars');
      browser.wait(ExpectedConditions.presenceOf(thumbnailBoardPage.thumbnails.get(0)));
      expect(thumbnailBoardPage.thumbnails.get(0).isDisplayed()).toBe(true);
    });
  });

  describe('hover on thumbnail :', () => {
    beforeAll(() => {
      appPage.searchContentByKeyword('star wars');
      browser.wait(() => thumbnailBoardPage.thumbnails.count().then(count => count > 0));
      thumbnailBoardPage.hoverThumbnail(0);
    });

    afterAll(() => {
      AppPage.clearInput(appPage.searchBar);
    });

    it('should display content overview', () => {
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0).$('.card-title')));
      expect(thumbnailBoardPage.thumbnails.get(0).$('.card-title').isDisplayed()).toBe(true);
    });

    it('should display content toWatch button', () => {
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0).$('.btn.to-watch')));
      expect(thumbnailBoardPage.thumbnails.get(0).$('.btn.to-watch').isDisplayed()).toBe(true);
    });

    it('should display content watched button', () => {
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0).$('.btn.watched')));
      expect(thumbnailBoardPage.thumbnails.get(0).$('.btn.watched').isDisplayed()).toBe(true);
    });

    describe('redirection on click', () => {
      it('should not redirect to detail page when content watched button is clicked', () => {
        thumbnailBoardPage.toggleWatchedState(0);
        expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
        thumbnailBoardPage.toggleWatchedState(0);
      });

      it('should not redirect to detail page when content to watch button is clicked', () => {
        thumbnailBoardPage.toggleToWatchState(0);
        expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
        thumbnailBoardPage.toggleToWatchState(0);
      });

      it('should redirect to detail page when content thumbnail is clicked', () => {
        thumbnailBoardPage.clickDetailLink(0);
        expect(contentDetailPage.rootEl.isDisplayed()).toBe(true);
        thumbnailBoardPage.navigateTo();
      });
    });
  });

  describe('when user filters results :', () => {
    beforeAll(() => {
      appPage.searchContentByKeyword('star wars');
      filtersPanelPage.enableMovieFilter();
      filtersPanelPage.enableTvShowFilter();
      browser.wait(() => thumbnailBoardPage.thumbnails.count().then(count => count > 0));
    });

    afterAll(() => {
      filtersPanelPage.enableMovieFilter();
      filtersPanelPage.enableTvShowFilter();
    });

    it('should contain all results at first when all filters are disabled', () => {
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
      expect(thumbnailBoardPage.isThumbnailPresent('Star Wars')).toBe(true);
    });

    describe('content type filters', () => {
      it('should display all results when all type filter checkbox disabled', () => {
        filtersPanelPage.disableTvShowFilter();
        filtersPanelPage.disableMovieFilter();
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars Rebels')).toBe(true);
        filtersPanelPage.enableTvShowFilter();
        filtersPanelPage.enableMovieFilter();
      });

      it('should not display movies when corresponding checkbox disabled', () => {
        filtersPanelPage.disableMovieFilter();
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars')).toBe(false);
        filtersPanelPage.enableMovieFilter();
      });

      it('should not display tvshows when corresponding checkbox disabled', () => {
        filtersPanelPage.enableMovieFilter();
        filtersPanelPage.disableTvShowFilter();
        browser.wait(() => thumbnailBoardPage.thumbnails.count().then(count => count > 0));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars Rebels')).toBe(false);
        filtersPanelPage.enableMovieFilter();
      });
    });

    describe('date filters', () => {
      it('should not display contents with date inferior to minimum date filter', () => {
        filtersPanelPage.filterByGtDate('12/12/2008');
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars: Episode I - ThePhantom Menace')).toBe(false);
        AppPage.clearInput(filtersPanelPage.gtDateEl);
      });

      it('should not display contents with date superior to maximum date filter', () => {
        filtersPanelPage.filterByLtDate('12/13/2016');
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars: The Last Jedi')).toBe(false);
        AppPage.clearInput(filtersPanelPage.ltDateEl);
      });

      it('should display empty component when minimum date exceeds maximum date', () => {
        filtersPanelPage.filterByLtDate('12/13/2016');
        filtersPanelPage.filterByGtDate('12/13/2017');
        expect(thumbnailBoardPage.thumbnails.count()).toBe(0);
        AppPage.clearInput(filtersPanelPage.gtDateEl);
        AppPage.clearInput(filtersPanelPage.ltDateEl);
      });
    });

    describe('filters conservation throughout navigation', () => {
      beforeAll(() => {
        filtersPanelPage.filterByGtDate('12/16/2000');
        filtersPanelPage.filterByLtDate('01/03/2017');
        filtersPanelPage.disableMovieFilter();
        filtersPanelPage.enableTvShowFilter();
        thumbnailBoardPage.clickDetailLink(0);
        appPage.searchContentByKeyword('Astérix');
      });

      afterAll(() => {
        AppPage.clearInput(filtersPanelPage.gtDateEl);
        AppPage.clearInput(filtersPanelPage.ltDateEl);
      });

      it('should keep min release date filter', () => {
        expect(filtersPanelPage.gtDateEl.getAttribute('value')).toEqual('2000-12-16');
      });

      it('should keep max release date filter', () => {
        expect(filtersPanelPage.ltDateEl.getAttribute('value')).toEqual('2017-01-03');
      });

      it('should keep movie content type filter', () => {
        expect(filtersPanelPage.toggleMovieEl.isSelected()).toBe(false);
      });

      it('should keep tv show content type filter', () => {
        expect(filtersPanelPage.toggleTvShowEl.isSelected()).toBe(true);
      });
    });
  });

  describe('marked contents conservation througout user sessions : ', () => {
    beforeAll(() => {
      browser.executeScript('window.localStorage.clear()');
      appPage.searchContentByKeyword('star wars');
      browser.wait(() => thumbnailBoardPage.thumbnails.count().then(count => count > 0));
      thumbnailBoardPage.toggleToWatchState(0);
      thumbnailBoardPage.toggleWatchedState(0);
      browser.refresh();
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.rootEl));
      appPage.searchContentByKeyword('star wars');
      browser.wait(() => thumbnailBoardPage.thumbnails.count().then(count => count > 0));
    });

    it('should keep to watch marker', () => {
      expect(thumbnailBoardPage.isContentToWatch(0)).toBe(true);
    });

    it('should keep watched marker', () => {
      expect(thumbnailBoardPage.isContentWatched(0)).toBe(true);
    });

    afterAll(() => {
      browser.executeScript('window.localStorage.clear()');
    });
  });
});
