import { browser, by, By, ExpectedConditions } from 'protractor';
import { ContentDetailPage } from '../page-objects/content-detail.po';
import { FilterSPanelPage as FiltersPanelPage } from '../page-objects/filters-panel.po';
import { ThumbnailBoardPage } from '../page-objects/thumbnail-board.po';

describe('Thumbnail board', () => {
  let thumbnailBoardPage: ThumbnailBoardPage;
  let filtersPanelPage: FiltersPanelPage;
  let contentDetailPage: ContentDetailPage;

  beforeAll(() => {
    thumbnailBoardPage = new ThumbnailBoardPage();
    filtersPanelPage = new FiltersPanelPage();
    contentDetailPage = new ContentDetailPage();
  });

  it('should display search page', () => {
    thumbnailBoardPage.navigateTo();
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
    thumbnailBoardPage.searchContentByKeyword('star');
    browser.wait(ExpectedConditions.presenceOf(thumbnailBoardPage.thumbnailsParentEl.$('.content-thumbnail')));
    expect(thumbnailBoardPage.thumbnailsParentEl.$('.content-thumbnail').isDisplayed()).toBe(true);
  });

  it('should collapse filters panel when user clicks on the close button', () => {
    filtersPanelPage.collapseFiltersPanel();
    expect(filtersPanelPage.gtDateEl.isPresent()).toBe(false);
  });

  it('should display contents thumbnails aside from filter panel with no overlap', () => {
    filtersPanelPage.expandFiltersPanel();
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
    thumbnailBoardPage.searchContentByKeyword('harry');
    expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
  });

  describe('when redirected from detail page', () => {
    it('should display previous search result ', () => {
      expect(thumbnailBoardPage.thumbnails.getSize()).not.toBe(0);
    });

    it('should display previous search in searchbar', () => {
      browser.wait(ExpectedConditions.presenceOf(thumbnailBoardPage.searchBar));
      expect(thumbnailBoardPage.searchBar.getAttribute('value')).toEqual('harry');
    });
  });

  describe('when user filters results', () => {
    beforeAll(() => {
      thumbnailBoardPage.searchContentByKeyword('star wars');
    });

    it('should contain all results at first when all filters are disaled', done => {
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
      thumbnailBoardPage.isThumbnailPresent('Star Wars').then(res => {
        expect(res).toBe(true);
        done();
      }, () => fail());
    });

    it('should not display movies when corresponding checkbox disabled', done => {
      filtersPanelPage.toggleMovieFilter();
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
      thumbnailBoardPage.isThumbnailPresent('Star Wars').then(res => {
        expect(res).toBe(false);
        done();
      }, () => fail());
    });

    it('should display all results when all type filter checkbox disabled', done => {
      filtersPanelPage.toggleTvShowFilter();
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
      thumbnailBoardPage.isThumbnailPresent('Star Wars Rebels').then(res => {
        expect(res).toBe(true);
        done();
      }, () => fail());
    });

    it('should not display tvshows when corresponding checkbox disabled', done => {
      filtersPanelPage.toggleMovieFilter();
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
      thumbnailBoardPage.isThumbnailPresent('Star Wars Rebels').then(res => {
        expect(res).toBe(false);
        done();
      }, () => fail());
    });

    it('should not display contents with date inferior to minimum date filter', done => {
      filtersPanelPage.filterByGtDate('12/12/2008');
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
      thumbnailBoardPage.isThumbnailPresent('Star Wars: Episode I - ThePhantom Menace').then(res => {
        expect(res).toBe(false);
        done();
      }, () => fail());
    });

    it('should not display contents with date superior to maximum date filter', done => {
      filtersPanelPage.filterByLtDate('13/12/2017');
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0)));
      thumbnailBoardPage.isThumbnailPresent('Star Wars: The Last Jedi').then(res => {
        expect(res).toBe(false);
        done();
      }, () => fail());
    });

    it('should display empty component when minimum date exceeds maximum date', done => {
      filtersPanelPage.filterByLtDate('13/12/2001');
      thumbnailBoardPage.thumbnails.count().then(nb => {
        expect(nb).toBe(0);
        done();
      }, () => fail());
    });
  });
});
