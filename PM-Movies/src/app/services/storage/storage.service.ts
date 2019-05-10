import { Injectable } from '@angular/core';

import { Content } from '../../models';
import { LocalStorageService } from '../local-storage';
import { IStorageService } from './storage.service.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements IStorageService {

  constructor(private storage: LocalStorageService) { }

  public getStoredContents(): Content[] {
    return this.storage.getStoredContents();
  }

  public storeMarkedContent(content: Content) {
    return this.storage.storeMarkedContent(content);
  }

  public removeMarkedContentFromStorage(content: Content): void {
    if (content && !content.watched && !content.toWatch) {
      return this.storage.removeMarkedContentFromStorage(content);
    }
  }
}
