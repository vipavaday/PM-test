import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  Content,
  Filter
} from '../../models';
import { IFilterManagerService } from './filter-manager.service.interface';

/**
 * Service handling filters on content and related update triggers
 */
@Injectable({
  providedIn: 'root'
})
export class FilterManagerService implements IFilterManagerService {

  public filtersUpdateSource = new BehaviorSubject<Filter>(new Filter());
  public $filtersUpdated = this.filtersUpdateSource.asObservable();

  public filterContents(contents: Content[]): Content[] {
    if (!contents) {
      throw new Error('#filterContents: filters or contents parameter should not be undefined');
    }

    return contents.map(content => {
      const matchesType = this.filterByContentType(this.filtersUpdateSource.value, content);
      const matchesDate = this.filterByReleaseDate(this.filtersUpdateSource.value, content);
      content.visible = matchesType && matchesDate;

      return content;
    });
  }

  private filterByReleaseDate(filters: Filter, content: Content): boolean {

    if (!content.releaseDate) {
      return false;
    }

    const matchesLtDate = content.releaseDate.getTime() < new Date(filters.ltReleaseDate).getTime() || !filters.ltReleaseDate;
    const matchesGtDate = content.releaseDate.getTime() > new Date(filters.gtReleaseDate).getTime() || !filters.gtReleaseDate;

    return matchesLtDate && matchesGtDate;
  }

  private filterByContentType(filters: Filter, content: Content): boolean {
    return !!filters.contentTypes.has(content.type) || filters.contentTypes.size === 0;
  }
}
