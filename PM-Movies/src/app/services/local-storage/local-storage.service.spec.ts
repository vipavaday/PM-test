import { LocalStorageService } from './local-storage.service';
import { Content } from 'src/app/models';

describe('Service: LocalStorageService', () => {
  let localStorageService: LocalStorageService;
  let content: Content;
  let spyGetItem: jasmine.Spy;

  beforeEach(() => {
    localStorageService = new LocalStorageService();
    content = new Content('The Lord of The Ring', 180, new Date('12/12/2001'));
    content.tmdbId = 6854;
    spyOn(window.localStorage, 'setItem');

    spyGetItem = spyOn(window.localStorage, 'getItem');
    spyGetItem.and.callFake(() => JSON.stringify([]));
  });

  describe('#new', () => {
    it('should be created', () => {
      expect(localStorageService).toBeTruthy();
    });
  });

  describe('#getStoredContent', () => {
    it('should return empty array when localstorage is empty', () => {
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    describe('when localstorage is not empty', () => {
      let markedContents: Content[];

      beforeEach(() => {
        spyGetItem.and.callFake(() => JSON.stringify([content]));
        markedContents = localStorageService.getStoredContents();
      });

      it('should return content array ', () => {
        expect(markedContents).not.toEqual([]);
      });

      it('should set the tmbId ', () => {
        expect(markedContents[0].tmdbId).toEqual(6854);
      });

      it('should set the title ', () => {
        expect(markedContents[0].title).toEqual('The Lord of The Ring');
      });

      it('should set the duration ', () => {
        expect(markedContents[0].duration).toEqual(180);
      });

      it('should set the releaseDate ', () => {
        expect(markedContents[0].releaseDate).toEqual(new Date('12/12/2001'));
      });
    });
  });

  describe('#storeMarkedContent', () => {
    beforeEach(() => {
      content.toWatch = true;
    });

    it('should add content to localstorage if not present and only toWatch', () => {
      localStorageService.storeMarkedContent(content);
      expect(localStorage.setItem).toHaveBeenCalledWith('storedContents', JSON.stringify([content]));
    });

    it('should add content to localstorage if not present and only watched', () => {
      localStorageService.storeMarkedContent(content);
      expect(localStorage.setItem).toHaveBeenCalledWith('storedContents', JSON.stringify([content]));
    });

    it('should update content in localstorage if already present', () => {
      spyGetItem.and.callFake(() => JSON.stringify([content]));
      content.watched = true;
      localStorageService.storeMarkedContent(content);
      expect(localStorage.setItem).toHaveBeenCalledWith('storedContents', JSON.stringify([content]));
    });

    it('should support undefined content', () => {
      expect(() => localStorageService.storeMarkedContent(undefined)).not.toThrow();
    });

    it('should do nothing if content is undefined', () => {
      spyOn(localStorageService, 'removeMarkedContentFromStorage');
      expect(localStorageService.removeMarkedContentFromStorage).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should remove content if not marked anymore', () => {
      content.toWatch = false;
      spyGetItem.and.callFake(() => JSON.stringify([content]));
      spyOn(localStorageService, 'removeMarkedContentFromStorage');
      localStorageService.storeMarkedContent(content);
      expect(localStorageService.removeMarkedContentFromStorage).toHaveBeenCalledWith(
        jasmine.objectContaining({
          tmdbId: 6854,
          title: 'The Lord of The Ring',
          duration: 180,
          releaseDate: new Date('12/12/2001'),
          watched: false,
          toWatch: false
        }));
    });
  });

  describe('#removeMarkedContentFromStorage', () => {
    let spyGetStoredContents: jasmine.Spy;

    beforeEach(() => {
      spyGetStoredContents = spyOn(localStorageService, 'getStoredContents');
    });

    it('should support undefined content', () => {
      expect(() => localStorageService.removeMarkedContentFromStorage(undefined)).not.toThrow();
    });

    it('should do nothing if content is undefined', () => {
      localStorageService.removeMarkedContentFromStorage(undefined);
      expect(localStorageService.getStoredContents).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should do nothing if content is not in localStorage', () => {
      spyGetStoredContents.and.callFake(() => []);
      localStorageService.removeMarkedContentFromStorage(content);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should remove content from localstorage if present', () => {
      spyGetStoredContents.and.callFake(() => [content]);
      localStorageService.removeMarkedContentFromStorage(content);
      expect(localStorage.setItem).toHaveBeenCalledWith('storedContents', JSON.stringify([]));
    });
  });
});
