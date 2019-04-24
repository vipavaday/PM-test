import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { ContentThumbnailComponent } from '.';
import {
  StorageService,
  StorageServiceMock
} from '../../services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Content } from 'src/app/models';

describe('ContentThumbnailComponent', () => {
  let component: ContentThumbnailComponent;
  let fixture: ComponentFixture<ContentThumbnailComponent>;
  let storageService: StorageService;

  beforeEach(() => {
    const testbed = TestBed.configureTestingModule({
      declarations: [ContentThumbnailComponent],
      providers: [
        { provide: StorageService, useClass: StorageServiceMock }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    testbed.compileComponents();
    storageService = testbed.get(StorageService);
    fixture = testbed.createComponent(ContentThumbnailComponent);
    component = fixture.componentInstance;
  });

  describe('#new', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('#toggleWatchList', () => {
    beforeEach(() => {
      spyOn(storageService, 'storeMarkedContent').and.callFake(() => {});
      component.content = new Content();
    });

    it('should throw an error when event parameter is undefined', () => {
      expect(() => component.toggleWatchList(undefined)).toThrow();
    });

    it('should toggle toWatch property of content', () => {
      component.toggleWatchList(new Event(''));
      expect(component.content.toWatch).toBe(true);
    });

    it('should call storeMarkedContent', () => {
      component.toggleWatchList(new Event(''));
      expect(storageService.storeMarkedContent).toHaveBeenCalledWith(component.content);
    });

    it('should stop event propagation', () => {
      const event = new Event('');
      spyOn(event, 'stopPropagation');
      component.toggleWatchList(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('#toggleWatchedContent', () => {
    beforeEach(() => {
      spyOn(storageService, 'storeMarkedContent').and.callFake(() => {});
      component.content = new Content();
    });

    it('should throw an error when event parameter is undefined', () => {
      expect(() => component.toggleWatchedContent(undefined)).toThrow();
    });

    it('should toggle watched property of content', () => {
      component.toggleWatchedContent(new Event(''));
      expect(component.content.watched).toBe(true);
    });

    it('should call storeMarkedContent', () => {
      component.toggleWatchedContent(new Event(''));
      expect(storageService.storeMarkedContent).toHaveBeenCalledWith(component.content);
    });

    it('should stop event propagation', () => {
      const event = new Event('');
      spyOn(event, 'stopPropagation');
      component.toggleWatchedContent(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });
});
