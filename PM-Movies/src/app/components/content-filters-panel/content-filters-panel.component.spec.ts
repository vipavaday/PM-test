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

  describe('#toggleShowMovies', () => {

    it('should call toogleContentType on filter', () => {
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
