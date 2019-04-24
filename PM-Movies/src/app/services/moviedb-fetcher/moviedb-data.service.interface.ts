import { Observable } from 'rxjs';

import {
  Content,
  Person,
  ContentType
} from '../../models';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
export interface IMoviedbDataService {

  /**
     * Searches for content of any type matching the provided string (title)
     **/
  getContentInfo(title: string): Observable<Content[]>;

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  getContentDetails(type: ContentType, id: number): Observable<Content>;

  /**
   * Retrieves detailed information about someone
   * @param personId Person identifier for the MovieDB API
   */
  getPersonDetails(personId: number, person?: Person): Observable<Person>;

  /**
   * Retrieves extra backdrop images for the provided content
   */
  getExtraImages(content: Content): Observable<string[]>;
}
