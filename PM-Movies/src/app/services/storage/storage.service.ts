import { Injectable } from '@angular/core';
import { Content } from 'src/app/models';
import { IStorageService } from './storage.service.interface';
import { LocalStorageService } from '../local-storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements IStorageService {

  constructor (private storage: LocalStorageService) {}

  public getStoredContents(): Content[] {
    return this.storage.getStoredContents();
  }

  public addToWatchlist(content: Content) {
    return this.storage.addToWatchlist(content);
  }

  public removeFromWatchedContents(content: Content) {
    return this.storage.removeFromWatchedContents(content);
  }

  public removeFromWatchList(content: Content) {
    return this.storage.removeFromWatchList(content);
  }

  public addToWatchedContents(content: Content) {
    return this.storage.addToWatchedContents(content);
  }
}
