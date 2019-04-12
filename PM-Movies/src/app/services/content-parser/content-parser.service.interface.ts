export type MDBOriginCountryJSON = string[];

export type MDBGenreIdsJSON = string[];

export interface MDBCreditsJSON {
  cast?: MDBCastJSON[];
  crew?: MDBCrewJSON[];
}

export interface MDBCastJSON {
  cast_id: number;
  character: string;
  gender: number;
  name: string;
  profile_path: string;
}

export interface MDBCrewJSON {
  name: string;
  job: string;
}

export interface MDBProdCountryJSON {
  iso_3166_1: string;
  name: string;
}

export interface MDBGenreDetailsJSON {
  id: number;
  name: string;
}

export interface MDBResultJSON {
  id: number;
  poster_path?: string;
  adult?: boolean;
  overview?: string;
  release_date?: string;
  original_title?: string;
  genre_ids?: number[];
  original_language?: string;
  vote_count?: number;
  backdrop_path?: string;
  vote_average?: number;
  popularity?: number;
  genres?: MDBGenreDetailsJSON[];
  media_type: 'movie' | 'tv' | 'person';
}

export interface MDBMovieJSON extends MDBResultJSON {
  title?: string;
  video?: boolean;
  runtime?: number;
  production_countries?: MDBProdCountryJSON[];
  media_type: 'movie';
}

export interface MDBTvShowJSON extends MDBResultJSON {
  first_air_date?: string;
  origin_country?: string[];
  name?: string;
  original_name?: string;
  episode_run_time?: number[];
  created_by?: MDBCrewJSON[];
  media_type: 'tv';
}

export interface MDBPersonJSON {
  id: number;
  media_type: 'person';
}

export interface MDBSearchResponseJSON {
  page: number;
  total_results: number;
  total_pages: number;
  results: (MDBMovieJSON | MDBTvShowJSON | MDBPersonJSON)[];
}
