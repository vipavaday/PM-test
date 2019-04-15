import {
  MDBCrewJSON,
  MDBPersonJSON
} from '../people-parser';

export type MDBOriginCountryJSON = string[];

export type MDBGenreIdsJSON = string[];

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

export interface MDBSearchResponseJSON {
  page: number;
  total_results: number;
  total_pages: number;
  results: (MDBMovieJSON | MDBTvShowJSON | MDBPersonJSON)[];
}

export interface MDBImageJSON {
  aspect_ratio?: number;
  file_path?: string;
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

export interface MDBContentImagesJSON {
  id: number;
  backdrops: MDBImageJSON[];
  posters: MDBImageJSON[];
}
