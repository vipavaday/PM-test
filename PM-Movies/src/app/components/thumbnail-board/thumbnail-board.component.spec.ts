import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { of } from 'rxjs';
import {
  map,
  switchMap
} from 'rxjs/operators';

import {
  Content,
  Filter
} from '../../models';

import {
  ContentFetcherService,
  ContentFetcherServiceMock,
  ContentListStateService,
  ContentListStateServiceMock,
  FilterManagerService,
  FilterManagerServiceMock
} from '../../services';

import { ThumbnailBoardComponent } from './thumbnail-board.component';

describe('ThumbnailBoardComponent', () => {
  let component: ThumbnailBoardComponent;
  let fixture: ComponentFixture<ThumbnailBoardComponent>;
  let contentDataProvider: ContentFetcherService;
  let contentListStateService: ContentListStateService;
  let filterManager: FilterManagerService;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      declarations: [
        ThumbnailBoardComponent
      ],
      providers: [
        { provide: ContentFetcherService, useClass: ContentFetcherServiceMock },
        { provide: ContentListStateService, useClass: ContentListStateServiceMock },
        { provide: FilterManagerService, useClass: FilterManagerServiceMock },
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    testBed.compileComponents();

    contentDataProvider = testBed.get(ContentFetcherService);
    contentListStateService = testBed.get(ContentListStateService);
    filterManager = testBed.get(FilterManagerService);
    fixture = testBed.createComponent(ThumbnailBoardComponent);
    component = fixture.componentInstance;
  });

  describe('#new', () => {
    let contents: Content[];

    beforeEach(() => {
      contents = [new Content()];
      spyOn(contentDataProvider, 'getContentInfo').and.callFake(() => of(contents));
      spyOn(filterManager, 'filterContents').and.callFake(() => [contents]);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should subscribe to query updates to fetch content', done => {
      contentListStateService.queryUpdatedSource.next('blabla');
      contentListStateService.queryUpdated$.subscribe(() => {
        expect(contentDataProvider.getContentInfo).toHaveBeenCalled();
        done();
      }, () => fail());
    });

    it('should subscribe to filter updates to update visible content', done => {
      filterManager.filtersUpdateSource.next(new Filter());
      filterManager.$filtersUpdated.subscribe(() => {
        expect(filterManager.filterContents).toHaveBeenCalled();
        done();
      }, () => fail());
    });

    it('should initialize component content array', () => {
      expect(component.contents).toEqual([]);
    });
  });

  describe('#getVisibleContents', () => {
    it('should return only content with their visible property set to true', () => {
      component.contents = [];
      component.contents.push(new Content('a'));
      component.contents.push(new Content('b'));
      component.contents.push(new Content('c'));
      component.contents[0].visible = false;
      component.contents[1].visible = true;
      component.contents[2].visible = false;
      expect(component.getVisibleContents()).toEqual([<any>jasmine.objectContaining<Content>({
        title: 'b'
      })]);
    });
  });
});
