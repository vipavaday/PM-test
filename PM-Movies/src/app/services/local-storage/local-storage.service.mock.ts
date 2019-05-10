import { Injectable } from '@angular/core';

import { Content } from '../../models';
import { IStorageService } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceMock implements IStorageService {

  public getStoredContents(): Content[] {
    return [];
  }

  public storeMarkedContent(content: Content): void {
  }

  public removeMarkedContentFromStorage(content: Content): void {
  }
}
