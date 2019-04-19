import { Cast, Person, Content } from 'src/app/models';

export interface IPeopleParser {
  parseCast(json: MDBCastJSON, cast: Cast): Cast;

  parsePerson(json: MDBPersonJSON, imgBaseUrl: string, person: Person): Person;

  parseContentCredits(json: MDBCreditsJSON, content: Content): Content;

  parseDirectorsFromCredits(json: MDBCreditsJSON, content: Content): Content;
}

export interface MDBPeopleJSON {
  id: number;
  gender?: number;
  name: string;
  profile_path: string;
}

export interface MDBPersonJSON extends MDBPeopleJSON {
  media_type: 'person';
  birthday?: string;
  deathday?: string;
  popularity: number;
  biography: string;
}

export interface MDBCastJSON extends MDBPeopleJSON {
  cast_id: number;
  character: string;
}

export interface MDBCrewJSON {
  name: string;
  job: string;
}

export interface MDBCreditsJSON {
  cast?: MDBCastJSON[];
  crew?: MDBCrewJSON[];
}
