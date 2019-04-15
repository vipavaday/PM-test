import { Injectable } from '@angular/core';
import { Content, Cast, Person } from 'src/app/models';
import {
  MDBCreditsJSON,
  MDBCastJSON,
  MDBPersonJSON,
  MDBPeopleJSON
} from './people-parser.service.interface';

@Injectable({
  providedIn: 'root'
})
export class PeopleParserService {

  public parseCast(json: MDBCastJSON, cast = new Cast()): Cast {

    cast.person.id = json.id;
    cast.person.gender = json.gender;
    cast.person.name = json.name;
    cast.cast_id = json.cast_id;
    cast.character = json.character;

    return cast;
  }

  public parsePerson(json: MDBPersonJSON, imgBaseUrl: string, person = new Person()): Person {

    person.biography = json.biography;
    person.birthday = json.birthday;
    person.deathday = json.deathday;
    person.popularity = json.popularity;
    person.avatarPath = imgBaseUrl + json.profile_path;

    return person;
  }

  public parseCredits(json: MDBCreditsJSON, casts: Cast[] = []): Cast[] {

    casts = json.cast.map(castJson => this.parseCast(castJson));

    return casts;
  }
}
