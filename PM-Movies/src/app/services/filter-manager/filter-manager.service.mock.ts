import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import {
  Filter,
  Content
} from 'src/app/models';

import { IFilterManagerService } from './filter-manager.service.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterManagerServiceMock implements IFilterManagerService {

  public filtersUpdateSource = new ReplaySubject<Filter>();
  public $filtersUpdated = this.filtersUpdateSource.asObservable();

  public filterContents(filters: Filter, contents: Content[]): Content[] {
    return [];
  }
}
