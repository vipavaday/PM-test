import { TestBed } from '@angular/core/testing';

import {
  MDBCastJSON,
  MDBPersonJSON,
  MDBCreditsJSON,
  MDBCrewJSON
} from './people-parser.service.interface';
import { Cast, Person, Content } from '../../models';
import { PeopleParserService } from './people-parser.service';

describe('Services: PeopleParserService', () => {
  let peopleParserService: PeopleParserService;
  let mdbCastJSON: MDBCastJSON;
  let mdbCreditsJson: MDBCreditsJSON;
  let mdbCrewJson: MDBCrewJSON;
  let cast: Cast;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      providers: [
        PeopleParserService
      ]
    });

    peopleParserService = testBed.get(PeopleParserService);

    mdbCastJSON = {
      cast_id: 32,
      character: 'Bran',
      id: 7896,
      name: 'Isaac Hampstead Wright',
      profile_path: '/avatar/45sd.png',
      gender: 0
    };

    mdbCrewJson = {
      job: 'Director',
      name: 'Roland Emmerich'
    };

    cast = {
      cast_id: 32,
      character: 'Bran',
      person: {
        id: 7896,
        name: 'Isaac Hampstead Wright',
        avatarPath: '/avatar/45sd.png',
        gender: 0
      }
    };

    mdbCreditsJson = {
      cast: [mdbCastJSON],
      crew: [mdbCrewJson,
        {
          job: 'Executive Director',
          name: 'Steven Spielberg'
        }
      ]
    };
  });

  describe('#parseCast', () => {
    it('should throw an error when json is undefined', () => {
      expect(() => peopleParserService.parseCast(undefined))
        .toThrowError('#parseCast: json should not be undefined');
    });

    it('should return a cast', () => {
      expect(peopleParserService.parseCast(mdbCastJSON))
        .toEqual(jasmine.objectContaining<Cast>({
          cast_id: 32,
          character: 'Bran',
          person: <any>jasmine.objectContaining<Person>({
            gender: 0,
            id: 7896,
            name: 'Isaac Hampstead Wright',
          })
        }));
    });

    it('should update cast parameter properties when provided', () => {
      const providedCast = new Cast();
      peopleParserService.parseCast(mdbCastJSON, providedCast);
      expect(providedCast)
        .toEqual(jasmine.objectContaining<Cast>({
          cast_id: 32,
          character: 'Bran',
          person: <any>jasmine.objectContaining<Person>({
            gender: 0,
            id: 7896,
            name: 'Isaac Hampstead Wright',
          })
        }));
    });
  });

  describe('#parsePerson', () => {
    let mdbPersonJson: MDBPersonJSON;

    beforeEach(() => {
      mdbPersonJson = {
        media_type: 'person',
        biography: 'bio',
        birthday: '12/12/2001',
        deathday: undefined,
        popularity: 5,
        profile_path: '/avatar.png',
        id: 20,
        name: 'tom'
      };
    });

    it('should throw an error when json undefined', () => {
      expect(() => peopleParserService.parsePerson(undefined, 'imgBaseUrl'))
        .toThrowError('#parsePerson: json and imageBaseUrl parameters should not be undefined');
    });

    it('should throw an error when imageBaseUrl undefined', () => {
      expect(() => peopleParserService.parsePerson(mdbPersonJson, undefined))
        .toThrowError('#parsePerson: json and imageBaseUrl parameters should not be undefined');
    });
  });

  describe('#parseContentCredits', () => {

    beforeEach(() => {
      spyOn(peopleParserService, 'parseCast')
        .and.returnValue(cast);

      spyOn(peopleParserService, 'parseDirectorsFromCredits')
        .and.callFake(() => {
          const content = new Content();
          content.directors = ['Tim Burton'];
          return content;
        });
    });
    describe('when undefined parameter', () => {
      it('should throw an error when json parameter is undefined', () => {
        expect(() => peopleParserService.parseContentCredits(undefined))
          .toThrowError('#parseContentCredits: json parameter should not be undefined');
      });
    });

    describe('when optional content parameter not provided', () => {
      it('should return a content with its cast property set', () => {
        expect(peopleParserService.parseContentCredits(mdbCreditsJson))
          .toEqual(jasmine.objectContaining<Content>({
            cast: <any>[
              jasmine.objectContaining<Cast>({
                cast_id: 32,
                character: 'Bran',
                person: <any>jasmine.objectContaining<Person>({
                  id: 7896,
                  name: 'Isaac Hampstead Wright',
                  avatarPath: '/avatar/45sd.png',
                  gender: 0
                })
              })
            ]
          }));
      });

      it('should call parseCast once', () => {
        peopleParserService.parseContentCredits(mdbCreditsJson);
        expect(peopleParserService.parseCast).toHaveBeenCalledTimes(1);
      });
    });

    describe('when optional content parameter is provided', () => {
      it('should update cast property of the optionaly provided content', () => {
        const providedContent = new Content();
        peopleParserService.parseContentCredits(mdbCreditsJson, providedContent);
        expect(providedContent)
          .toEqual(jasmine.objectContaining<Content>({
            cast: <any>[
              jasmine.objectContaining<Cast>({
                cast_id: 32,
                character: 'Bran',
                person: <any>jasmine.objectContaining<Person>({
                  id: 7896,
                  name: 'Isaac Hampstead Wright',
                  avatarPath: '/avatar/45sd.png',
                  gender: 0
                })
              })
            ]
          }));
      });

      it('should not parse directors when already set', () => {
        const providedContent = new Content();
        providedContent.directors = ['Alphonso Cuaron'];
        peopleParserService.parseContentCredits(mdbCreditsJson, providedContent);
        expect(peopleParserService.parseDirectorsFromCredits).not.toHaveBeenCalled();
      });

      it('should parse directors when unset', () => {
        const providedContent = new Content();
        peopleParserService.parseContentCredits(mdbCreditsJson, providedContent);
        expect(peopleParserService.parseDirectorsFromCredits)
          .toHaveBeenCalledWith(mdbCreditsJson, providedContent);
      });
    });
  });

  describe('#parseDirectorsFromCredits', () => {

    it('should throw an error when json parameter is undefined', () => {
      expect(() => peopleParserService.parseDirectorsFromCredits(undefined))
        .toThrowError('#parseDirectorsFromCredits: json parameter should not be undefined');
    });

    it('should return a content with its directors property set', () => {
      expect(peopleParserService.parseDirectorsFromCredits(mdbCreditsJson))
      .toEqual(jasmine.objectContaining<Content>({
        directors: ['Roland Emmerich']
      }));
    });

    it('should filter crew members to keep only directors', () => {
      expect(peopleParserService.parseDirectorsFromCredits(mdbCreditsJson).directors.length).toBe(1);
    });

    it('should set optional content parameter directors property', () => {
      const providedContent = new Content();
      peopleParserService.parseDirectorsFromCredits(mdbCreditsJson, providedContent);
      expect(providedContent.directors).toEqual(['Roland Emmerich']);
    });
  });
});
