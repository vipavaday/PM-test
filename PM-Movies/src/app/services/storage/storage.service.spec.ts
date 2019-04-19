import { TestBed } from '@angular/core/testing';

import {
  LocalStorageServiceMock,
  LocalStorageService
} from '../local-storage';

import { StorageService } from './storage.service';
import { Content } from 'src/app/models';

describe('Services: StorageService', () => {
  let storageService: StorageService;
  let localStorageService: LocalStorageServiceMock;
  let content: Content;

  beforeEach(() => {

    const testBed = TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: LocalStorageService, useClass: LocalStorageServiceMock }
      ]
    });
    storageService = testBed.get(StorageService);
    localStorageService = testBed.get(LocalStorageService);
    content = new Content('The Lord of The Ring', 180, new Date('12/12/2001'));
    content.tmdbId = 5468;
    content.watched = true;
  });

  describe('#new', () => {
    it('should be created', () => {
      expect(storageService).toBeTruthy();
    });
  });

  describe('#getStoredContents', () => {

    beforeEach(() => {
      spyOn(localStorageService, 'getStoredContents');
    });

    it('should call localStorage getStoredContents method', () => {
      storageService.getStoredContents();
      expect(localStorageService.getStoredContents).toHaveBeenCalled();
    });
  });

  describe('#storeMarkedContent', () => {

    beforeEach(() => {
      spyOn(localStorageService, 'storeMarkedContent');
    });

    it('should call localStorage getStoredContents', () => {
      storageService.storeMarkedContent(content);
      expect(localStorageService.storeMarkedContent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'The Lord of The Ring',
          duration: 180,
          releaseDate: new Date('12/12/2001'),
          watched: true,
          toWatch: false
        })
      );
    });
  });

  describe('#removeMarkedContentFromStorage', () => {

    beforeEach(() => {
      spyOn(localStorageService, 'removeMarkedContentFromStorage');
    });

    it('should support undefined content', () => {
      expect(() => storageService.removeMarkedContentFromStorage(undefined)).not.toThrow();
    });

    it('should do nothing if content is still marked', () => {
      storageService.removeMarkedContentFromStorage(content);
      expect(localStorageService.removeMarkedContentFromStorage).not.toHaveBeenCalled();
    });

    it('should call localStorage removeMarkedContentFromStorage', () => {
      content.watched = false;
      storageService.removeMarkedContentFromStorage(content);
      expect(localStorageService.removeMarkedContentFromStorage)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          title: 'The Lord of The Ring',
          duration: 180,
          releaseDate: new Date('12/12/2001'),
          watched: false,
          toWatch: false
        }));
    });
  });
});
