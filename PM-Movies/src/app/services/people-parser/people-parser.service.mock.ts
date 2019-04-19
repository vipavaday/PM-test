import { Injectable } from '@angular/core';

import {
  Cast,
  Person,
  Content
} from 'src/app/models';

import {
  MDBCreditsJSON,
  MDBCastJSON,
  MDBPersonJSON,
  IPeopleParser
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
  public parseDirectorsFromCredits(json: MDBCreditsJSON, content= new Content()): Content {
    return content;
  }
}
