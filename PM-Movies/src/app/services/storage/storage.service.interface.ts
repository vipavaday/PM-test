import { Content } from '../../models';

export interface IStorageService {

  /**
   * Retrieves stored content from localStorage
   */
  getStoredContents(): Content[];

  /**
   * Stores a content in local storage if any its toWatch or watched property is true
   */
  storeMarkedContent(content: Content): void;

  /**
  * Removes a content from localStorage
  */
  removeMarkedContentFromStorage(content: Content): void;
}
