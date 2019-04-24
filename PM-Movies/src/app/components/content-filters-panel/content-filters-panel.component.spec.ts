import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  FilterManagerService,
  FilterManagerServiceMock
} from '../../services';

import { Filter } from '../../models';

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
      providers: [
        { provide: FilterManagerService, useClass: FilterManagerServiceMock }
      ]
    });
    testBed.compileComponents();

    filterManager = testBed.get(FilterManagerService);
    fixture = testBed.createComponent(ContentFiltersPanelComponent);
    contentFilterPanel = fixture.componentInstance;
    spyOnUpdateFilter = spyOn(contentFilterPanel, 'onUpdateFilter');
    spyOnUpdateFilter.and.callFake(() => {});
    spyOn(contentFilterPanel.filter, 'toggleContentType').and.callFake(() => {});
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
    it('should call onUpdateFilter method', () => {
      contentFilterPanel.ngOnInit();
      expect(spyOnUpdateFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('#updateGtDate', () => {
    it('should throw an error when parameter is not parsable as a date', () => {
      expect(() => contentFilterPanel.updateGtDate('82/24/1987'))
      .toThrowError('#updateGtDate: gtDate should follow dd/mm/yyyy formmat');
    });

    it('should set filter greater than date property', () => {
      contentFilterPanel.updateGtDate('12/12/1987');
      expect(contentFilterPanel.filter.gtReleaseDate).toBe('12/12/1987');
    });

    it('should call onUpdateFilter method', () => {
      contentFilterPanel.updateGtDate('12/12/1987');
      expect(spyOnUpdateFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('#updateLtDate', () => {
    it('should throw an error when parameter is not parsable as a date', () => {
      expect(() => contentFilterPanel.updateLtDate('82/24/1987'))
      .toThrowError('#updateLtDate: ltDate should follow dd/mm/yyyy formmat');
    });

    it('should set filter lower than date property', () => {
      contentFilterPanel.updateLtDate('12/12/1987');
      expect(contentFilterPanel.filter.ltReleaseDate).toBe('12/12/1987');
    });

    it('should call onUpdateFilter method', () => {
      contentFilterPanel.updateLtDate('12/12/1987');
      expect(spyOnUpdateFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toggleShowMovies', () => {

    it('should call toogleContentType on filter', () => {
      contentFilterPanel.toggleShowMovies();
      expect(contentFilterPanel.filter.toggleContentType).toHaveBeenCalledWith('movie');
    });

    it('should call onUpdateFilter method', () => {
      contentFilterPanel.toggleShowMovies();
      expect(spyOnUpdateFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toggleShowTvShow', () => {
    it('should call toogleContentType on filter', () => {
      contentFilterPanel.toggleShowTvShows();
      expect(contentFilterPanel.filter.toggleContentType).toHaveBeenCalledWith('tv');
    });

    it('should call onUpdateFilter method', () => {
      contentFilterPanel.toggleShowTvShows();
      expect(spyOnUpdateFilter).toHaveBeenCalledTimes(1);
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
