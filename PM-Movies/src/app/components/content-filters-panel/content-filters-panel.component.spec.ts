import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import {
  FilterManagerService,
  FilterManagerServiceMock
} from '../../services';

import { ContentFiltersPanelComponent } from './content-filters-panel.component';

describe('Component: ContentFiltersPanelComponent', () => {
  let contentFilterPanel: ContentFiltersPanelComponent;
  let filterManager: FilterManagerService;
  let fixture: ComponentFixture<ContentFiltersPanelComponent>;
  let spyOnUpdateFilter: jasmine.Spy;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      declarations: [
        ContentFiltersPanelComponent
      ],
      imports: [
        FormsModule,
      ],
      providers: [
        { provide: FilterManagerService, useClass: FilterManagerServiceMock }
      ]
    });
    testBed.compileComponents();

    filterManager = testBed.get(FilterManagerService);
    fixture = testBed.createComponent(ContentFiltersPanelComponent);
    contentFilterPanel = fixture.componentInstance;
    spyOnUpdateFilter = spyOn(contentFilterPanel, 'onUpdateFilter');
    spyOnUpdateFilter.and.callFake(() => { });
    spyOn(contentFilterPanel.filter, 'toggleContentType').and.callFake(() => { });
    spyOn(filterManager.filtersUpdateSource, 'getValue');
  });

  describe('#new', () => {
    it('should create', () => {
      expect(contentFilterPanel).toBeTruthy();
    });

    it('should initialize filter property', () => {
      expect(contentFilterPanel.filter).not.toBeUndefined();
    });
  });

  describe('#ngOnInit', () => {
    it('should retrieve last filter', () => {
      contentFilterPanel.ngOnInit();
      expect(filterManager.filtersUpdateSource.getValue).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toggleShowMovies', () => {

    it('should call toggleContentType on filter', () => {
      contentFilterPanel.toggleMovieFilter();
      expect(contentFilterPanel.filter.toggleContentType).toHaveBeenCalledWith('movie');
    });

    it('should call onUpdateFilter method', () => {
      contentFilterPanel.toggleMovieFilter();
      expect(spyOnUpdateFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toggleShowTvShow', () => {
    it('should call toogleContentType on filter', () => {
      contentFilterPanel.toggleTvshowFilter();
      expect(contentFilterPanel.filter.toggleContentType).toHaveBeenCalledWith('tv');
    });

    it('should call onUpdateFilter method', () => {
      contentFilterPanel.toggleTvshowFilter();
      expect(spyOnUpdateFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('#getMinLtDate', () => {
    it('should return absolute min date when gtDate is missing', () => {
      expect(contentFilterPanel.getMinLtDate()).toEqual(new Date('1850-01-01'));
    });

    it('should return gtDate when it is available', () => {
      contentFilterPanel.filter.gtReleaseDate = '2010-09-13';
      expect(contentFilterPanel.getMinLtDate()).toEqual(new Date('2010-09-13'));
    });
  });

  describe('#getTodayDate', () => {
    it('should return current date', () => {
      expect(contentFilterPanel.getTodayDate()).toEqual(new Date());
    });
  });

  describe('#getMaxGtDate', () => {
    it('should return current date when ltDate is missing', () => {
      expect(contentFilterPanel.getMaxGtDate()).toEqual(new Date());
    });

    it('should return ltDate when it is available', () => {
      contentFilterPanel.filter.ltReleaseDate = '2014-11-20';
      expect(contentFilterPanel.getMaxGtDate()).toEqual(new Date('2014-11-20'));
    });
  });

  describe('#onUpdateFilter', () => {
    beforeEach(() => {
      spyOnUpdateFilter.and.callThrough();
    });

    it('should emit new value on filterManagerService subject', done => {
      filterManager.filtersUpdateSource.subscribe(() => done());
      contentFilterPanel.onUpdateFilter();
    });
  });
});
