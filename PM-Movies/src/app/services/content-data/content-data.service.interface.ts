import { Observable } from 'rxjs';

import {
  Cast,
  Content,
} from '../../models';


export interface IContentDataService {
  getContentInfo(title: string): Observable<Content[]>;
  getContentDetails(type: string, id: string): Observable<Content>;
  isSeen(tmdbId: number): boolean;
  isToWatch(tmdbId: number): boolean;
  addToWatchList(content: Content): void;
  removeFromWatchList(content: Content): void;
  addToSeenContent(content: Content): void;
  removeFromSeenContent(content: Content): void;
}

export type MDBOriginCountryJSON = string[];

export type MDBGenreIdsJSON = string[];

export interface MDBSearchResultMovieJSON {
  poster_path?: string;
  adult?: boolean;
  overview?: string;
  release_date?: string;
  original_title?: string;
  genre_ids?: number[];
  id?: number;
  media_type: 'movie';
  original_language?: string;
  title?: string;
  backdrop_path?: string;
  popularity?: number;
  vote_count?: number;
  video?: boolean;
  vote_average?: number;
}

export interface MDBSearchResultTvShowJSON {
  poster_path?: string;
  adult?: boolean;
  overview?: string;
  release_date?: string;
  original_title?: string;
  genre_ids?: number[];
  id?: number;
  media_type: 'tv';
  first_air_date?: string;
  origin_country?: string;
  original_language?: string;
  vote_count?: number;
  name?: string;
  original_name?: string;
  backdrop_path?: string;
  popularity?: number;
  vote_average?: number;
}

export interface MDBSearchResultPersonJSON {
  media_type: 'person';
}

export interface MDBCreditsResponseJSON {

  cast: MDBCastResponseJSON[];
  crew: MDBCrewResponseJSON[];
}

export interface MDBCastResponseJSON {

  cast_id: number;
  character: string;
  gender: number;
  name: string;
}

export interface MDBCrewResponseJSON {

  name: string;
  job: string;
}

export interface MDBMovieDetailsResponseJSON {

  id: number;
  poster_path: any;
  vote_average: number;
  original_title: string;
  release_date: string;
  runtime: number;
}

export interface MDBTvShowDetailsResponseJSON {

  id: number;
  poster_path: any;
  vote_average: number;
  first_air_date: string;
  name: string;
  episode_run_time: number[];
}

export interface MDBSearchResponseJSON {
  page: number;
  total_results: number;
  total_pages: number;
  results: (MDBSearchResultMovieJSON | MDBSearchResultTvShowJSON | MDBSearchResultPersonJSON)[];
}
