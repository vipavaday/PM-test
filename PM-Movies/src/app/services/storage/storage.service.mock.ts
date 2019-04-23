import { Injectable } from '@angular/core';

import { Content } from 'src/app/models';
import { IStorageService } from './storage.service.interface';


@Injectable({
  providedIn: 'root'
})
export class StorageServiceMock implements IStorageService {

  public getStoredContents(): Content[] {
    return [];
  }

  public storeMarkedContent(content: Content): void {
  }

  public removeMarkedContentFromStorage(content: Content): void {
  }
}
