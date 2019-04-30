import { browser, by, By, ExpectedConditions } from 'protractor';
import { ContentDetailPage } from '../page-objects/content-detail.po';
import { ThumbnailBoardPage } from '../page-objects/thumbnail-board.po';

describe('Thumbnail board', () => {
  let thumbnailBoardPage: ThumbnailBoardPage;
  let contentDetailPage: ContentDetailPage;

  beforeAll(() => {
    thumbnailBoardPage = new ThumbnailBoardPage();
    contentDetailPage = new ContentDetailPage();
  });

  it('should display search page', () => {
    thumbnailBoardPage.navigateTo();
    expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
  });

  it('should display expanded filter panel ', () => {
    expect(thumbnailBoardPage.filterPanelEl.isDisplayed()).toBe(true);
  });

  it('should display focusable min date filter input', () => {
    expect(thumbnailBoardPage.gtDateEl.isDisplayed()).toBe(true);
  });

  it('should display focusable max date filter input', () => {
    expect(thumbnailBoardPage.ltDateEl.isDisplayed()).toBe(true);
  });

  it('should display focusable tv show filter input', () => {
    expect(thumbnailBoardPage.toggleTvShowEl.isDisplayed()).toBe(true);
  });

  it('should display focusable movie filter input', () => {
    expect(thumbnailBoardPage.toggleMovieEl.isDisplayed()).toBe(true);
  });

  it('should display empty component', () => {
    expect(thumbnailBoardPage.emptyComponentEl.isDisplayed()).toBe(true);
  });

  it('should display display search results when user types keywords in the searchbar', () => {
    thumbnailBoardPage.searchContentByKeyword('star');
    browser.wait(ExpectedConditions.presenceOf(thumbnailBoardPage.thumbnailsParentEl.$('.content-thumbnail')));
    expect(thumbnailBoardPage.thumbnailsParentEl.$('.content-thumbnail').isDisplayed()).toBe(true);
  });

  it('should collapse filters panel when user clicks on the close button', () => {
    thumbnailBoardPage.collapseFiltersPanel();
    expect(thumbnailBoardPage.gtDateEl.isPresent()).toBe(false);
  });

  it('should display contents thumbnails aside from filter panel with no overlap', () => {
    thumbnailBoardPage.expandFiltersPanel();
    expect(thumbnailBoardPage.thumbnails.get(0).isDisplayed()).toBe(true);
  });

  describe('hover on thumbnail', () => {
    beforeAll(() => {
      thumbnailBoardPage.hoverThumbnail(0);
    });

    it('should display content overview on thumbnail hover', () => {
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0).$('.card-title')));
      expect(thumbnailBoardPage.thumbnails.get(0).$('.card-title').isDisplayed()).toBe(true);
    });

    it('should display content toWatch button on thumbnail hover', () => {
      browser.wait(ExpectedConditions.visibilityOf(thumbnailBoardPage.thumbnails.get(0).$('.btn.to-watch')));
      expect(thumbnailBoardPage.thumbnails.get(0).$('.btn.to-watch').isDisplayed()).toBe(true);
    });

    it('should display content watched button on thumbnail hover', () => {
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

  it('should redirect to thumbnail board page when user types a keyword in the searchbar', () => {
    thumbnailBoardPage.searchContentByKeyword('harry');
    expect(thumbnailBoardPage.rootEl.isDisplayed()).toBe(true);
  });

  it('should display previous search result when redirected from detail page', () => {
    expect(thumbnailBoardPage.thumbnails.getSize()).not.toBe(0);
  });
});
