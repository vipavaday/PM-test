
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
