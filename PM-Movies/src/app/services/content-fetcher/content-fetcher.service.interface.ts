import { Observable } from 'rxjs';

import {
  Content,
  Cast,
  ContentType
} from '../../models';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
export interface IContentFetcherService {

  /**
  * Searches for content of any type matching the provided string (title)
  **/
  getContentInfo(title: string): Observable<Content[]>;

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  getContentDetails(type: ContentType, tmdbId: number): Observable<Content>;

  /**
   * Fetch details for the 10 most important casts of the specified content
   * @param content content for which we want to fetch casts details
   */
  getCastDetails(content: Content): Observable<Cast[]>;

  /**
   * Fetch backdrop images related to the provided content
   */
  getExtraImages(content: Content): Observable<string[]>;
}
