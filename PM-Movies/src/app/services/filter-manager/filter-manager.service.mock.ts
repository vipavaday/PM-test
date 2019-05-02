import { Injectable } from '@angular/core';

import { BehaviorSubject, ReplaySubject } from 'rxjs';

import {
  Content,
  Filter
} from 'src/app/models';

import { IFilterManagerService } from './filter-manager.service.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterManagerServiceMock implements IFilterManagerService {

  public filtersUpdateSource = new BehaviorSubject<Filter>(new Filter());
  public $filtersUpdated = this.filtersUpdateSource.asObservable();

  public filterContents(clearcontents: Content[]): Content[] {
    return [];
  }
}
