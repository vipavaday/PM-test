import { Injectable } from '@angular/core';

import {
  Cast,
  Content,
  Person
} from '../../models';

import {
  IPeopleParser,
  MDBCastJSON,
  MDBCreditsJSON,
  MDBPersonJSON
} from './people-parser.service.interface';

@Injectable({
  providedIn: 'root'
})
export class PeopleParserServiceMock implements IPeopleParser {

  public parseCast(json: MDBCastJSON, cast = new Cast()): Cast {
    return cast;
  }

  public parsePerson(json: MDBPersonJSON, imgBaseUrl: string, person = new Person()): Person {
    return person;
  }

  public parseContentCredits(json: MDBCreditsJSON, content = new Content()): Content {
    return content;
  }
  public parseDirectorsFromCredits(json: MDBCreditsJSON, content = new Content()): Content {
    return content;
  }
}
