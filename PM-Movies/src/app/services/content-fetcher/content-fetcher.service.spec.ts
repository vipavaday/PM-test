import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import {
  ContentFetcherService,
  MoviedbDataService,
  MoviedbDataServiceMock,
  StorageService,
  StorageServiceMock
} from '../../services';

import {
  Content,
  Cast,
  Person
} from '../../models';

describe('Services: ContentFetcherService', () => {
  let contentFetcherService: ContentFetcherService;
  let moviedbDataService: MoviedbDataService;
  let storageService: StorageService;
  let providedContent: Content;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      providers: [
        ContentFetcherService,
        { provide: MoviedbDataService, useClass: MoviedbDataServiceMock },
        { provide: StorageService, useClass: StorageServiceMock }
      ]
    });
    storageService = testBed.get(StorageService);
    moviedbDataService = testBed.get(MoviedbDataService);
    contentFetcherService = testBed.get(ContentFetcherService);

    providedContent = new Content();
    providedContent.cast.push({
      cast_id: 789,
      character: 'Jon Snow',
      person: {
        id: 65,
        name: '',
        gender: 0,
        avatarPath: ''
      }
    });
  });

  describe('#new', () => {
    it('should be created', () => {
      expect(contentFetcherService).toBeTruthy();
    });
  });

  describe('#getContentInfo', () => {
    let spyGetStoredContents: jasmine.Spy;
    let spyGetContentInfo: jasmine.Spy;

    beforeEach(() => {
      const contents: Content[] = [];
      contents.push(new Content('Harry Potter', 190, new Date('10/08/2012'), 32));
      contents.push(new Content('The jungle book', 130, new Date('10/02/2019'), 78));
      spyGetStoredContents = spyOn(storageService, 'getStoredContents');
      spyGetStoredContents.and.returnValue([]);

      spyGetContentInfo = spyOn(moviedbDataService, 'getContentInfo');
      spyGetContentInfo.and.returnValue(of(contents));
    });

    it('should support undefined title parameter', () => {
      expect(() => contentFetcherService.getContentInfo(undefined)).
        not.toThrow();
    });

    it('should support empty storage', () => {
      expect(() => contentFetcherService.getContentInfo('Metropolis')).
        not.toThrow();
    });

    it('should return observable of empty array when undefined title parameter', done => {
      contentFetcherService.getContentInfo(undefined).subscribe(contentItems => {
        expect(contentItems).toEqual(jasmine.arrayWithExactContents([]));
        done();
      }, () => fail());
    });

    it('should call moviedbDataFetcher getContentInfo method', done => {
      contentFetcherService.getContentInfo('The Hobbit').subscribe(contentItems => {
        expect(moviedbDataService.getContentInfo).toHaveBeenCalledWith('The Hobbit');
        done();
      }, () => fail());
    });


    it('should call check if retrieved content are marked in storage', done => {
      contentFetcherService.getContentInfo('The Hobbit').subscribe(contentItems => {
        expect(storageService.getStoredContents).toHaveBeenCalled();
        done();
      }, () => fail());
    });

    it('should return a non empty observable array of contents', done => {
      contentFetcherService.getContentInfo('Harry Potter').subscribe(contentItems => {
        expect(contentItems).toEqual(jasmine.arrayWithExactContents([
          jasmine.objectContaining<Content>({
            title: 'Harry Potter',
            duration: 190,
            releaseDate: new Date('10/08/2012'),
            tmdbId: 32
          }),
          <any>jasmine.objectContaining<Content>({
            title: 'The jungle book',
            duration: 130,
            releaseDate: new Date('10/02/2019'),
            tmdbId: 78
          })
        ]));
        done();
      }, () => fail());
    });


    it('should set the watched property of returned contents according to storage data', done => {
      const content = new Content('The jungle book', 130, new Date('10/02/2019'), 78);
      content.watched = true;
      spyGetStoredContents.and.returnValue([
        content
      ]);
      contentFetcherService.getContentInfo('Harry Potter').subscribe(contentItems => {
        expect(contentItems).toEqual(jasmine.arrayWithExactContents([
          jasmine.objectContaining<Content>({
            title: 'Harry Potter',
            duration: 190,
            releaseDate: new Date('10/08/2012'),
            tmdbId: 32,
            watched: false,
            toWatch: false
          }),
          <any>jasmine.objectContaining<Content>({
            title: 'The jungle book',
            duration: 130,
            releaseDate: new Date('10/02/2019'),
            tmdbId: 78,
            watched: true,
            toWatch: false
          })
        ]));
        done();
      }, () => fail());
    });

    it('should set the toWatch property of returned contents according to storage data', done => {
      const content = new Content('The jungle book', 130, new Date('10/02/2019'), 78);
      content.toWatch = true;
      spyGetStoredContents.and.returnValue([
        content
      ]);
      contentFetcherService.getContentInfo('Harry Potter').subscribe(contentItems => {
        expect(contentItems).toEqual(jasmine.arrayWithExactContents([
          jasmine.objectContaining<Content>({
            title: 'Harry Potter',
            duration: 190,
            releaseDate: new Date('10/08/2012'),
            tmdbId: 32,
            watched: false,
            toWatch: false
          }),
          <any>jasmine.objectContaining<Content>({
            title: 'The jungle book',
            duration: 130,
            releaseDate: new Date('10/02/2019'),
            tmdbId: 78,
            watched: false,
            toWatch: true
          })
        ]));
        done();
      }, () => fail());
    });
  });

  describe('#getContentDetails', () => {
    let spyGetContentDetails: jasmine.Spy;

    beforeEach(() => {
      spyGetContentDetails = spyOn(moviedbDataService, 'getContentDetails');
      spyGetContentDetails.and.returnValue(of([]));
    });

    it('should support undefined type parameter', () => {
      expect(() => contentFetcherService.getContentDetails(undefined, 45))
        .not.toThrow();
    });

    it('should support undefined type parameter', () => {
      expect(() => contentFetcherService.getContentDetails('movie', undefined))
        .not.toThrow();
    });

    it('should call moviedbDataFetcher getContentDetail method', done => {
      contentFetcherService.getContentDetails('movie', 45).subscribe(contentItem => {
        expect(moviedbDataService.getContentDetails).toHaveBeenCalledWith('movie', 45);
        done();
      }, () => fail());
    });
  });

  describe('#getCastDetails', () => {
    beforeEach(() => {
      const castsDetails: Cast[] = [];
      castsDetails.push({
        cast_id: 789,
        character: 'Jon Snow',
        person: {
          avatarPath: 'avatar.jpg',
          biography: 'bla...bla...bla',
          id: 65,
          birthday: '14/05/1987',
          deathday: undefined,
          gender: 0,
          name: 'Kit Harington',
        }
      });

      spyOn(moviedbDataService, 'getPersonDetails')
        .and.callFake((personId: number, person: Person) => {
          person.birthday = castsDetails[0].person.birthday;
          person.deathday = castsDetails[0].person.deathday;
          person.biography = castsDetails[0].person.biography;
          person.gender = castsDetails[0].person.gender;
          return of(castsDetails);
        });
    });

    it('should throw an error when content parameter undefined', () => {
      expect(() => contentFetcherService.getCastDetails(undefined))
        .toThrowError('#getCastDetails: content parameter should not be undefined');
    });

    it('should return cast details for provided content', done => {
      contentFetcherService.getCastDetails(providedContent).subscribe(castItems => {
        expect(castItems).toContain(
          jasmine.objectContaining<Cast>({
            cast_id: 789,
            character: 'Jon Snow',
            person: <any>jasmine.objectContaining<Person>({
              biography: 'bla...bla...bla',
              birthday: '14/05/1987',
              deathday: undefined,
              gender: 0
            })
          }));
        done();
      }, () => fail());
    });

    it('should set cast details for provided content', done => {
      contentFetcherService.getCastDetails(providedContent).subscribe(castItems => {
        expect(providedContent.cast).toContain(
          jasmine.objectContaining<Cast>({
            cast_id: 789,
            character: 'Jon Snow',
            person: <any>jasmine.objectContaining<Person>({
              biography: 'bla...bla...bla',
              birthday: '14/05/1987',
              deathday: undefined,
              gender: 0
            })
          }));
        done();
      }, () => fail());
    });
  });

  describe('#getExtraImages', () => {
    beforeEach(() => {
      spyOn(moviedbDataService, 'getExtraImages').and.returnValue(of(['/backdrop1.png']));
    });

    it('should support undefined content', () => {
      expect(() => contentFetcherService.getExtraImages(undefined)).not.toThrow();
    });

    it('should call moviedbDataFetcher getExtraImages method', done => {
      contentFetcherService.getExtraImages(providedContent).subscribe(backdropItems => {
        expect(moviedbDataService.getExtraImages).toHaveBeenCalledWith(providedContent);
        done();
      }, () => fail());
    });

    it('should return contents extra backdrops path', done => {
      contentFetcherService.getExtraImages(providedContent).subscribe(backdropItems => {
        expect(backdropItems).toEqual(jasmine.arrayWithExactContents(['/backdrop1.png']));
        done();
      }, () => fail());
    });
  });
});

