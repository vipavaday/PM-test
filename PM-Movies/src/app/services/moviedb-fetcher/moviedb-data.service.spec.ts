import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { MoviedbDataService } from './moviedb-data.service';
import {
  PeopleParserService,
  PeopleParserServiceMock,
  MDBPersonJSON
} from '../people-parser';

import {
  ContentParserServiceMock,
  ContentParserService,
  MDBSearchResponseJSON,
  MDBContentImagesJSON,
  MDBContentJSON,
} from '../content-parser';
import { Content, Person } from 'src/app/models';

describe('Services: MoviedbDataService', () => {
  let moviedbDataService: MoviedbDataService;
  let httpClientService: HttpClient;
  let spyHttpClient: jasmine.Spy;
  let contentParser: ContentParserServiceMock;
  let peopleParser: PeopleParserServiceMock;
  let content: Content;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        MoviedbDataService,
        { provide: ContentParserService, useClass: ContentParserServiceMock },
        { provide: PeopleParserService, useClass: PeopleParserServiceMock }
      ]
    });

    httpClientService = testBed.get(HttpClient);
    spyHttpClient = spyOn(httpClientService, 'get');
    spyHttpClient.and.callFake(() => {
      return of({ images: { base_url: 'http://mock-poster-url' } });
    });
    contentParser = testBed.get(ContentParserService);
    peopleParser = testBed.get(PeopleParserService);
    moviedbDataService = testBed.get(MoviedbDataService);

    content = new Content('Cloud Atlas', 110, new Date('12/12/2012'));
    content.tmdbId = 4578;
    content.type = 'movie';
    content.posterUrl = 'http://mock-poster-url/poster/4578.png';
    content.originCountries = ['nz'];
  });

  describe('#new', () => {
    it('should be created', () => {
      expect(moviedbDataService).toBeTruthy();
    });
  });

  describe('#getContentInfo', () => {
    let searchResponse: MDBSearchResponseJSON;
    let spyParseContentList: jasmine.Spy;

    beforeEach(() => {
      searchResponse = {
        page: 1,
        total_results: 1,
        total_pages: 1,
        results: []
      };

      spyParseContentList = spyOn(contentParser, 'parseContentList');
      spyParseContentList.and.returnValue([content]);

      spyHttpClient.and.callFake((param) => {
        if (param.includes('/configuration')) {
          return of({ images: { base_url: 'http://mock-poster-url' } });
        } else if (param.includes('/search/multi')) {
          return of(searchResponse);
        }
      });
    });

    it('should support an undefined parameter', () => {
      expect(() => moviedbDataService.getContentInfo(undefined)).not.toThrow();
    });

    describe('when title is undefined', () => {
      it('should return empty array', () => {
        moviedbDataService.getContentInfo(undefined).subscribe(contents => {
          expect(contents).toEqual([]);
        });
      });

      it('should not emit http request', () => {
        moviedbDataService.getContentInfo(undefined);
        expect(spyHttpClient).toHaveBeenCalledTimes(1);
      });
    });

    it('should return non empty content array', () => {
      moviedbDataService.getContentInfo('Cloud Atlas').subscribe(contents => {
        expect(contents).toContain(
          jasmine.objectContaining<Content>({
            title: 'Cloud Atlas',
            duration: 110,
            releaseDate: new Date('12/12/2012'),
            posterUrl: 'http://mock-poster-url/poster/4578.png',
            type: 'movie'
          }));
      });
    });

    it('should filter returned array to exclude undefined objects', () => {
      searchResponse.results.push(undefined);
      spyHttpClient.and.returnValue(of(searchResponse));
      moviedbDataService.getContentInfo('Cloud Atlas').subscribe(contents => {
        expect(contents).not.toContain(undefined);
      });
    });
  });

  describe('#getContentDetails', () => {
    let spyParse: jasmine.Spy;
    beforeEach(() => {
      spyParse = spyOn(contentParser, 'parse');
      spyParse.and.returnValue(content);

      spyHttpClient.and.callFake((param) => {
        if (param.includes('/credits')) {
          return of({});
        } else if (param.includes('/tv')) {
          return of({ media_type: 'tv', id: 52 });
        } else if (param.includes('/movie')) {
          return of({});
        } else if (param.includes('/configuration')) {
          return of({ images: { base_url: 'http://mock-poster-url' } });
        }
      });
    });

    it('should throw Error when undefined type', () => {
      expect(() => moviedbDataService.getContentDetails(undefined, 5))
        .toThrowError();
    });

    it('should throw Error when undefined id', () => {
      expect(() => moviedbDataService.getContentDetails('tv', undefined))
        .toThrowError();
    });

    describe('when everything alright', () => {
      it('should call api', () => {
        moviedbDataService.getContentDetails('tv', 45);
        expect(spyHttpClient).toHaveBeenCalled();
      });

      it('should return content detail', done => {
        moviedbDataService.getContentDetails('movie', 4578).subscribe(resContent => {
          expect(resContent).toEqual(jasmine.objectContaining<Content>({
            type: 'movie',
            tmdbId: 4578,
            title: 'Cloud Atlas',
            releaseDate: new Date('12/12/2012'),
            duration: 110,
            originCountries: ['nz']
          }));
          done();
        }, () => fail());
      });

      it('should set content type on json before calling parser', done => {
        moviedbDataService.getContentDetails('movie', 45).subscribe(resContent => {
          expect(contentParser.parse).toHaveBeenCalledWith(
            jasmine.objectContaining<MDBContentJSON>({
              media_type: 'movie'
            }),
            'http://mock-poster-url/original/'
          );
          done();
        }, () => fail());
      });
    });
  });

  describe('#getPersonDetails', () => {
    let mdbPersonJson: MDBPersonJSON;

    beforeEach(() => {
      mdbPersonJson = {
        media_type: 'person',
        popularity: 2,
        biography: '',
        id: 7854,
        name: 'Sir Iann McKellen',
        profile_path: ''
      };
      spyHttpClient.and.returnValues(of(('config'), of(mdbPersonJson)));
      spyOn(peopleParser, 'parsePerson').and.callFake((personJson, imgBaseUrl, person = new Person()) => {
        person.popularity = 2;
        person.biography = '';
        person.id = 7854;
        person.name = 'Sir Iann McKellen';
        person.avatarPath = '';
        return person;
      });
    });

    it('should throw error when undefined personId', () => {
      expect(() => moviedbDataService.getPersonDetails(undefined))
        .toThrowError('#getPersonDetails: personId should not be undefined');
    });

    it('should return person details', done => {

      moviedbDataService.getPersonDetails(7854).subscribe(person => {
        expect(person).toEqual(jasmine.objectContaining<Person>({
          popularity: 2,
          biography: '',
          id: 7854,
          name: 'Sir Iann McKellen',
          avatarPath: ''
        }));
        done();
      }, () => fail());
    });

    it('should set provided person properties when provided', done => {
      const providedPerson = new Person();

      moviedbDataService.getPersonDetails(7854, providedPerson).subscribe(person => {
        expect(providedPerson).toEqual(jasmine.objectContaining<Person>({
          popularity: 2,
          biography: '',
          id: 7854,
          name: 'Sir Iann McKellen',
          avatarPath: ''
        }));
        done();
      }, () => fail());
    });
  });

  describe('#getExtraImages', () => {
    beforeEach(() => {

      const mdbContentImagesJSON: MDBContentImagesJSON = {
        id: 3904,
        backdrops: [{
          file_path: '/high-res/my-pic.png'
        }],
        posters: []
      };
      spyHttpClient.and.returnValue(of(mdbContentImagesJSON));
      spyOn(contentParser, 'parseContentImages')
        .and.callFake((contentImgJson: MDBContentImagesJSON, imgBaseUrl: string, providedContent = new Content()) => {
          providedContent.backdrops = ['/high-res/my-pic.png'];
          return providedContent.backdrops;
        });
    });

    it('should throw an error when content is undefined', () => {
      expect(() => moviedbDataService.getExtraImages(undefined))
        .toThrowError('#getExtraImages : content should not be undefined');
    });

    it('should return an array of backdrops for the content', done => {
      moviedbDataService.getExtraImages(new Content()).subscribe(backdrops => {
        expect(backdrops).toContain('/high-res/my-pic.png');
        done();
      }, () => fail());
    });

    it('should set content backdrops property', done => {
      const providedContent = new Content();
      moviedbDataService.getExtraImages(providedContent).subscribe(backdrops => {
        expect(providedContent.backdrops).toContain('/high-res/my-pic.png');
      }, () => fail());
      done();
    });
  });
});
