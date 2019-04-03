import { Observable } from 'rxjs';
import {
  Cast,
  Content,
} from '../../models';


export interface IContentDataService {
  searchInfoForContent(title: string): Observable<Content[]>;
  getContentDetail(type: string, id: string): Observable<Content>;
  getContentDuration(content: Content): Observable<number>;
  getContentCast(content: Content): Observable<Cast[]>;
  getDirector(content: Content): Observable<string>;
  isSeen(content: Content): boolean;
  isToWatch(content: Content): boolean;
  addToWatchList(content: Content): void;
  removeFromWatchList(content: Content): void;
  addToSeenContent(content: Content): void;
  removeFromSeenContent(content: Content): void;
}

export type MDBOriginCountryJSON = string[];

export type MDBGenreIdsJSON = string[];

/* export interface MDBSearchResultJSON {
  poster_path: string;
  popularity: number;
  id: number;
  overview: string;
  backdrop_path: string;
  vote_average: number;
  media_type: string;
  first_air_date: string;
  origin_country: MDBOriginCountryJSON;
  genre_ids: MDBGenreIdsJSON;
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
  original_title: string;
  release_date: string;
} */

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


export interface MDBSearchResponseJSON {
  page: number;
  total_results: number;
  total_pages: number;
  results: (MDBSearchResultMovieJSON | MDBSearchResultTvShowJSON | MDBSearchResultPersonJSON)[];
}
