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

  it('should display search page', () => {
    expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
  });

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

  it('should display empty component', () => {
    expect(thumbnailBoardPage.emptyComponentEl.isDisplayed()).toBe(true);
  });

  it('should display search results when user types keywords in the searchbar', () => {
    appPage.searchContentByKeyword('the hobbit');
    browser.wait(ExpectedConditions.presenceOf(thumbnailBoardPage.thumbnails.get(0)));
    expect(thumbnailBoardPage.thumbnails.get(0).isDisplayed()).toBe(true);
  });

  it('should collapse filters panel when user clicks on the close button', () => {
    filtersPanelPage.collapseFiltersPanel();
    expect(filtersPanelPage.gtDateEl.isPresent()).toBe(false);
  });

  it('should display contents thumbnails aside from filter panel with no overlap', () => {
    filtersPanelPage.expandFiltersPanel();
    browser.wait(ExpectedConditions.visibilityOf(filtersPanelPage.ltDateEl));
    browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
    expect(thumbnailBoardPage.thumbnails.get(0).isDisplayed()).toBe(true);
  });

  describe('hover on thumbnail', () => {
    beforeAll(() => {
      thumbnailBoardPage.hoverThumbnail(0);
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
  });

  it('should not redirect to detail page when content watched button is clicked', () => {
    thumbnailBoardPage.toggleWatchedState(0);
    expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
  });

  it('should not redirect to detail page when content to watch button is clicked', () => {
    thumbnailBoardPage.toggleToWatchState(0);
    expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
  });

  it('should redirect to detail page when content thumbnail is clicked', () => {
    thumbnailBoardPage.clickDetailLink(0);
    expect(contentDetailPage.rootEl.isDisplayed()).toBe(true);
  });

  it('should redirect to thumbnail board page when user types a keyword in the searchbar from detail page', () => {
    appPage.searchContentByKeyword('harry');
    expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
  });

  describe('when redirected from detail page', () => {
    it('should display previous search result ', () => {
      expect(thumbnailBoardPage.thumbnails.count()).not.toBe(0);
    });

    it('should display previous search in searchbar', () => {
      browser.wait(ExpectedConditions.presenceOf(appPage.searchBar));
      expect(appPage.searchBar.getAttribute('value')).toEqual('harry');
    });
  });

  describe('when user filters results', () => {
    beforeAll(() => {
      appPage.searchContentByKeyword('star wars');
    });

    it('should contain all results at first when all filters are disabled', () => {
      browser.wait(() => thumbnailBoardPage.thumbnails.count().then(count => count > 0));
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
      expect(thumbnailBoardPage.isThumbnailPresent('Star Wars')).toBe(true);
    });

    describe('content type filters', () => {
      it('should not display movies when corresponding checkbox disabled', () => {
        filtersPanelPage.disableMovieFilter();
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars')).toBe(false);
      });

      it('should display all results when all type filter checkbox disabled', () => {
        filtersPanelPage.disableTvShowFilter();
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars Rebels')).toBe(true);
      });

      it('should not display tvshows when corresponding checkbox disabled', () => {
        filtersPanelPage.enableMovieFilter();
        filtersPanelPage.disableTvShowFilter();
        browser.wait(() => thumbnailBoardPage.thumbnails.count().then(count => count > 0));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars Rebels')).toBe(false);
      });

      afterAll(() => {
        filtersPanelPage.enableMovieFilter();
        filtersPanelPage.enableTvShowFilter();
      });
    });

    describe('date filters', () => {
      it('should not display contents with date inferior to minimum date filter', () => {
        filtersPanelPage.filterByGtDate('12/12/2008');
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars: Episode I - ThePhantom Menace')).toBe(false);
      });

      it('should not display contents with date superior to maximum date filter', () => {
        filtersPanelPage.filterByLtDate('12/13/2016');
        browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
        expect(thumbnailBoardPage.isThumbnailPresent('Star Wars: The Last Jedi')).toBe(false);
      });

      it('should display empty component when minimum date exceeds maximum date', () => {
        filtersPanelPage.filterByGtDate('12/13/2017');
        expect(thumbnailBoardPage.thumbnails.count()).toBe(0);
      });

      afterAll(() => {
        filtersPanelPage.clearDate(filtersPanelPage.gtDateEl);
        filtersPanelPage.clearDate(filtersPanelPage.ltDateEl);
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

      afterAll(() => {
        filtersPanelPage.clearDate(filtersPanelPage.gtDateEl);
        filtersPanelPage.clearDate(filtersPanelPage.ltDateEl);
        filtersPanelPage.clearDate(filtersPanelPage.gtDateEl);
        filtersPanelPage.clearDate(filtersPanelPage.ltDateEl);
      });
    });
  });

  describe('marked contents conservation througout user sessions', () => {
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

  it('should redirect user to search page when app logo is clicked', () => {
    contentDetailPage.navigateTo('movie', '2639');

  });
});
