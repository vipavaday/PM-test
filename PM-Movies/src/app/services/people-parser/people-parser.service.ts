import { Injectable } from '@angular/core';
import { Cast, Content, Person } from 'src/app/models';
import { IPeopleParser, MDBCastJSON, MDBCreditsJSON, MDBPersonJSON } from './people-parser.service.interface';



@Injectable({
  providedIn: 'root'
})
export class PeopleParserService implements IPeopleParser {

  public parseCast(json: MDBCastJSON, cast = new Cast()): Cast {

    if (!json) {
      throw new Error('#parseCast: json should not be undefined');
    }

    cast.person.id = json.id;
    cast.person.gender = json.gender;
    cast.person.name = json.name;
    cast.cast_id = json.cast_id;
    cast.character = json.character;

    return cast;
  }

  public parsePerson(json: MDBPersonJSON, imgBaseUrl: string, person = new Person()): Person {

    if (!json || !imgBaseUrl) {
      throw new Error('#parsePerson: json and imageBaseUrl parameters should not be undefined');
    }

    person.biography = json.biography;
    person.birthday = json.birthday;
    person.deathday = json.deathday;
    person.popularity = json.popularity;
    person.avatarPath = imgBaseUrl + json.profile_path;

    return person;
  }

  public parseContentCredits(json: MDBCreditsJSON, content = new Content()): Content {
    if (!json) {
      throw new Error('#parseContentCredits: json parameter should not be undefined');
    }

    content.cast = json.cast.map(castJson => this.parseCast(castJson));
    if (content.directors.length === 0) {
      this.parseDirectorsFromCredits(json, content);
    }

    return content;
  }
  public parseDirectorsFromCredits(json: MDBCreditsJSON, content = new Content()): Content {

    if (!json) {
      throw new Error('#parseDirectorsFromCredits: json parameter should not be undefined');
    }

    content.directors = json.crew.filter(crewJson => crewJson.job === 'Director').map(crewJson => {
      return crewJson.name;
    });

    return content;
  }
}
