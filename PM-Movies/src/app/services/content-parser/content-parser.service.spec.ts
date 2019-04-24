import { TestBed } from '@angular/core/testing';

import { ContentParserService } from './content-parser.service';
import { Content, Person } from 'src/app/models';
import { MDBPersonJSON } from '../people-parser';
import {
  MDBMovieJSON,
  MDBTvShowJSON,
  MDBResultJSON,
  MDBSearchResponseJSON,
  MDBContentImagesJSON
} from '../content-parser';

describe('ContentParserService', () => {
  let contentParser: ContentParserService;
  let mdbMovieJson: MDBMovieJSON;
  let mdbTvShowJson: MDBTvShowJSON;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentParserService],
    });
    contentParser = TestBed.get(ContentParserService);

    mdbMovieJson = {
      id: 8236,
      media_type: 'movie',
      poster_path: '/minority-report/poster.png',
      vote_average: 4.5,
      overview: 'Tom Cruise ... pre-crime, ...',
      genres: [
        {
          id: 1,
          name: 'sci-fi'
        }
      ],
      original_title: 'Minority Report',
      release_date: '12/12/2009',
      runtime: 120,
      production_countries: [
        {
          iso_3166_1: 'us',
          name: 'United States of America'
        }
      ]
    };

    mdbTvShowJson = {
      id: 2975,
      media_type: 'tv',
      name: 'Game of Thrones',
      first_air_date: '12/12/2008',
      episode_run_time: [45],
      created_by: [
        {
          job: 'Creator',
          name: 'DB Weiss'
        }
      ],
      origin_country: ['us']
    };
  });

  it('should be created', () => {
    expect(contentParser).toBeTruthy();
  });

  describe('#parseContentList', () => {
    let mdbResponseJson: MDBSearchResponseJSON;
    let spyParse: jasmine.Spy;

    beforeEach(() => {
      spyParse = spyOn(contentParser, 'parse');
      spyParse.and.returnValue(new Content());
      mdbResponseJson = {
        page: 1,
        results: [
          mdbMovieJson,
          mdbMovieJson,
          mdbMovieJson
        ],
        total_pages: 1,
        total_results: 3
      };
    });

    it('should throw an error when response parameter is undefined', () => {
      expect(() => contentParser.parseContentList(undefined, 'imgBaseUrl'))
        .toThrowError('#parseContentList: response and imgBaseUrl parameters should not be undefined');
    });

    it('should throw an error when imgBaseUrl parameter is undefined', () => {
      expect(() => contentParser.parseContentList(mdbResponseJson, undefined))
        .toThrowError('#parseContentList: response and imgBaseUrl parameters should not be undefined');
    });

    it('should call parse method for each content in result json', () => {
      contentParser.parseContentList(mdbResponseJson, 'imgBaseUrl');
      expect(contentParser.parse).toHaveBeenCalledTimes(3);
    });

    it('should filter parsed results to exclude persons', () => {
      const person = new Content('a');
      person.type = 'person';
      const movie = new Content('b');
      movie.type = 'movie';
      const tvshow = new Content('c');
      tvshow.type = 'tv';
      spyParse.and.returnValues(person, tvshow, movie);

      expect(contentParser.parseContentList(mdbResponseJson, 'imgBaseUrl')).toEqual(jasmine.arrayWithExactContents([
        <any>jasmine.objectContaining<Content>({
          title: 'b'
        }),
        <any>jasmine.objectContaining<Content>({
          title: 'c'
        })
      ]));
    });
  });

  describe('#parse', () => {
    beforeEach(() => {
      spyOn(contentParser, 'parseTvShow').and.returnValue(new Content());
      spyOn(contentParser, 'parseMovie').and.returnValue(new Content());
    });

    it('should throw error when undefined json parameter', () => {
      expect(() => contentParser.parse(undefined, 'imgBaseUrl'))
        .toThrowError('#parse: json parameter should not be undefined');
    });

    it('should return empty content with type person when json parameter media_type is person', () => {
      const mdbPersonJson: MDBPersonJSON = {
        gender: 0,
        id: 7542,
        name: 'Orlando Blum',
        profile_path: '',
        media_type: 'person',
        biography: '',
        popularity: 4
      };
      expect(contentParser.parse(mdbPersonJson, 'imgBaseUrl'))
        .toEqual(jasmine.objectContaining<Content>({
          type: 'person'
        }));
    });

    it('should support undefined imgBaseUrl parameter', () => {
      expect(() => contentParser.parse(mdbMovieJson, undefined)).not.toThrow();
    });

    it('should call parseTvShow method when json parameter corresponds to a TvShow', () => {
      contentParser.parse(mdbTvShowJson, 'imgBaseUrl');
      expect(contentParser.parseTvShow).toHaveBeenCalledWith(mdbTvShowJson, 'imgBaseUrl', jasmine.any(Content));
    });

    it('should call parseMovie method when json parameter corresponds to a Movie', () => {
      contentParser.parse(mdbMovieJson, 'imgBaseUrl');
      expect(contentParser.parseMovie).toHaveBeenCalledWith(mdbMovieJson, 'imgBaseUrl', jasmine.any(Content));
    });

    describe('when optional content parameter properties is provided :', () => {
      it('should pass it to parseTvShow method when json represents a TvShow', () => {
        const providedContent = new Content();
        contentParser.parse(mdbTvShowJson, 'imgBaseUrl', providedContent);
        expect(contentParser.parseTvShow).toHaveBeenCalledWith(mdbTvShowJson, 'imgBaseUrl', providedContent);
      });

      it('should pass it to parseMovie method when json represents a Movie', () => {
        const providedContent = new Content();
        contentParser.parse(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(contentParser.parseMovie).toHaveBeenCalledWith(mdbMovieJson, 'imgBaseUrl', providedContent);
      });
    });
  });

  describe('#parseContentCommons', () => {
    it('should throw an error if json parameter is undefined', () => {
      expect(() => contentParser.parseContentCommons(undefined, 'imgBaseUrl'))
        .toThrowError('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
    });

    it('should throw an error if imgBaseUrl parameter is undefined', () => {
      expect(() => contentParser.parseContentCommons(mdbMovieJson, undefined))
        .toThrowError('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
    });

    describe('standard content initialization: ', () => {
      it('should initilize content id', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').tmdbId).toBe(8236);
      });

      it('should initilize content type', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').type).toBe('movie');
      });

      it('should initilize content posterUrl', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').posterUrl).toBe('imgBaseUrl/minority-report/poster.png');
      });

      it('should initilize content voteAverage', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').voteAverage).toBe(4.5);
      });

      it('should initilize content overview', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').overview).toBe('Tom Cruise ... pre-crime, ...');
      });

      it('should initilize content genres', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').genres).toEqual(['sci-fi']);
      });
    });

    describe('should set optional content parameter properties when provided', () => {
      let providedContent: Content;

      beforeEach(() => {
        providedContent = new Content();
      });

      it('should initilize content id', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.tmdbId).toBe(8236);
      });

      it('should initilize content type', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.type).toBe('movie');
      });

      it('should initilize content posterUrl', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.posterUrl).toBe('imgBaseUrl/minority-report/poster.png');
      });

      it('should initilize content voteAverage', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.voteAverage).toBe(4.5);
      });

      it('should initilize content overview', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.overview).toBe('Tom Cruise ... pre-crime, ...');
      });

      it('should initilize content genres', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.genres).toEqual(['sci-fi']);
      });
    });

    describe('content initialization edge-cases: ', () => {
      it('should set genres to empty array when undefined in json', () => {
        mdbMovieJson.genres = undefined;
        expect(contentParser.parseMovie(mdbMovieJson, 'baseImgUrl').genres).toEqual([]);
      });
    });
  });

  describe('#parseMovie', () => {
    beforeEach(() => {
      const spyParseContentCommons = spyOn(contentParser, 'parseContentCommons');
      spyParseContentCommons.and.callFake((json: MDBResultJSON, imgBaseUrl: string) => {
        if (!json || !imgBaseUrl) {
          throw new Error('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
        }
        return new Content();
      });
    });

    it('should throw an error when json parameter is undefined', () => {
      expect(() => contentParser.parseMovie(undefined, 'imgBaseUrl'))
        .toThrowError('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
    });

    it('should throw an error when imgBaseUrl parameter is undefined', () => {
      expect(() => contentParser.parseMovie(mdbMovieJson, undefined))
        .toThrowError('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
    });

    describe('standard content initialization: ', () => {

      it('should call parseContentCommons method', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl');
        expect(contentParser.parseContentCommons).toHaveBeenCalledWith(mdbMovieJson, 'imgBaseUrl', jasmine.any(Content));
      });

      it('should initilize content title', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').title).toBe('Minority Report');
      });

      it('should initilize content releaseDate', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').releaseDate).toEqual(new Date('12/12/2009'));
      });

      it('should initilize content duration', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').duration).toEqual(120);
      });

      it('should initilize content originCountries', () => {
        expect(contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl').originCountries).toEqual(['us']);
      });
    });

    describe('should set optional content parameter properties when provided :', () => {
      let providedContent: Content;

      beforeEach(() => {
        providedContent = new Content();
      });

      it('should call parseContentCommons method', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(contentParser.parseContentCommons).toHaveBeenCalledWith(mdbMovieJson, 'imgBaseUrl', providedContent);
      });

      it('should initilize content title', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.title).toBe('Minority Report');
      });

      it('should initilize content releaseDate', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.releaseDate).toEqual(new Date('12/12/2009'));
      });

      it('should initilize content duration', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.duration).toEqual(120);
      });

      it('should initilize content originCountries', () => {
        contentParser.parseMovie(mdbMovieJson, 'imgBaseUrl', providedContent);
        expect(providedContent.originCountries).toEqual(['us']);
      });
    });

    describe('content initialization edge-cases: ', () => {
      it('should set originCountry to empty array when undefined in json', () => {
        mdbMovieJson.production_countries = undefined;
        expect(contentParser.parseMovie(mdbMovieJson, 'baseImgUrl').originCountries).toEqual([]);
      });

      it('should set releaseDate to null when invalid date from json', () => {
        mdbMovieJson.release_date = '524524534';
        expect(contentParser.parseMovie(mdbMovieJson, 'baseImgUrl').releaseDate).toBeNull();
      });
    });
  });

  describe('#parseTvShow', () => {
    beforeEach(() => {
      const spyParseContentCommons = spyOn(contentParser, 'parseContentCommons');
      spyParseContentCommons.and.callFake((json: MDBResultJSON, imgBaseUrl: string) => {
        if (!json || !imgBaseUrl) {
          throw new Error('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
        }
        return new Content();
      });
    });

    it('should throw an error when json parameter is undefined', () => {
      expect(() => contentParser.parseTvShow(undefined, 'imgBaseUrl'))
        .toThrowError('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
    });

    it('should throw an error when imgBaseUrl parameter is undefined', () => {
      expect(() => contentParser.parseTvShow(mdbTvShowJson, undefined))
        .toThrowError('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
    });

    describe('standard content initialization: ', () => {

      it('should call parseContentCommons method', () => {
        contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl');
        expect(contentParser.parseContentCommons).toHaveBeenCalledWith(mdbTvShowJson, 'imgBaseUrl', jasmine.any(Content));
      });

      it('should initilize content title', () => {
        expect(contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl').title).toBe('Game of Thrones');
      });

      it('should initilize content releaseDate', () => {
        expect(contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl').releaseDate).toEqual(new Date('12/12/2008'));
      });

      it('should initilize content duration', () => {
        expect(contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl').duration).toEqual(45);
      });

      it('should initilize content originCountries', () => {
        expect(contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl').originCountries).toEqual(['us']);
      });
    });

    describe('should set optional content parameter properties when provided :', () => {
      let providedContent: Content;

      beforeEach(() => {
        providedContent = new Content();
      });

      it('should call parseContentCommons method', () => {
        contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl', providedContent);
        expect(contentParser.parseContentCommons).toHaveBeenCalledWith(mdbTvShowJson, 'imgBaseUrl', providedContent);
      });

      it('should initilize content title', () => {
        contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl', providedContent);
        expect(providedContent.title).toBe('Game of Thrones');
      });

      it('should initilize content releaseDate', () => {
        contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl', providedContent);
        expect(providedContent.releaseDate).toEqual(new Date('12/12/2008'));
      });

      it('should initilize content duration', () => {
        contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl', providedContent);
        expect(providedContent.duration).toEqual(45);
      });

      it('should initilize content originCountries', () => {
        contentParser.parseTvShow(mdbTvShowJson, 'imgBaseUrl', providedContent);
        expect(providedContent.originCountries).toEqual(['us']);
      });
    });

    describe('content initialization edge-cases: ', () => {
      it('should set originCountry to empty array when undefined in json', () => {
        mdbMovieJson.production_countries = undefined;
        expect(contentParser.parseMovie(mdbMovieJson, 'baseImgUrl').originCountries).toEqual([]);
      });

      it('should set releaseDate to null when invalid date from json', () => {
        mdbMovieJson.release_date = '524524534';
        expect(contentParser.parseMovie(mdbMovieJson, 'baseImgUrl').releaseDate).toBeNull();
      });
    });
  });

  describe('#parseContentImages', () => {
    let mdbImgJson: MDBContentImagesJSON;

    beforeEach(() => {
      mdbImgJson = {
        backdrops: [
          {
            file_path: 'backdrop1Path.png',
          }
        ],
        id: 45,
        posters: []
      };
    });

    it('should throw an error when json parameter is undefined', () => {
      expect(() => contentParser.parseContentImages(undefined, 'img'))
        .toThrowError('#parseContentImages: json and imgBaseUrl parameters should not be undefined');
    });

    it('should throw an error when imgBaseUrl parameter is undefined', () => {
      expect(() => contentParser.parseContentImages(mdbImgJson, undefined))
        .toThrowError('#parseContentImages: json and imgBaseUrl parameters should not be undefined');
    });

    it('should return a non empty array of backdrops path', () => {
      expect(contentParser.parseContentImages(mdbImgJson, 'imgBaseUrl/'))
        .toContain('imgBaseUrl/backdrop1Path.png');
    });

    it('should set optional content parameter array of backdrops when provided', () => {
      const providedContent = new Content();
      contentParser.parseContentImages(mdbImgJson, 'imgBaseUrl/', providedContent);
      expect(providedContent.backdrops).toContain('imgBaseUrl/backdrop1Path.png');
    });
  });
});
