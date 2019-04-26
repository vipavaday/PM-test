import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ContentListStateService,
  ContentListStateServiceMock
} from '../../services';


import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let contentListStateService: ContentListStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBarComponent
      ],
      providers: [
        { provide: ContentListStateService, useClass: ContentListStateServiceMock }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    contentListStateService = TestBed.get(ContentListStateService);
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;

    spyOn(contentListStateService, 'updateQuery').and.callFake(() => { });
  });

  describe('#new', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('#onSearchUpdate', () => {
    it('should call updateQuery method of contentListStateService', () => {
      component.onSearchUpdate('harry potter');
      expect(contentListStateService.updateQuery).toHaveBeenCalledWith('harry potter');
    });
  });
});
