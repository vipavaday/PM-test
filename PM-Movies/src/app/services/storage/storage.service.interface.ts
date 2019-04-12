import { Content } from 'src/app/models';

export interface IStorageService {

  getStoredContents(): Content[];

  addToWatchlist(content: Content): void;

  removeFromWatchList(content: Content): void;

  addToWatchedContents(content: Content): void;

  removeFromWatchedContents(content: Content): void;
}
