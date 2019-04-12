import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import {
  Filter,
  Content,
  Movie,
  TvShow
} from 'src/app/models';

/**
 * Service handling filters on content and related update triggers
 */
@Injectable({
  providedIn: 'root'
})
export class FilterManagerService {

  public filtersUpdateSource = new ReplaySubject<Filter>();
  public $filtersUpdated = this.filtersUpdateSource.asObservable();

  public filterContents(filters: Filter, contents: Content[]): Content[] {

    return contents.map(content => {
      const matchesType = this.filterByContentType(filters, content);
      const matchesDate = this.filterByReleaseDate(filters, content);
      content.visible = matchesType && matchesDate;

      return content;
    });
  }

  private filterByReleaseDate(filters: Filter, content: Content): boolean {

    const matchesLtDate = content.releaseDate.getTime() < new Date(filters.ltReleaseDate).getTime() || !filters.ltReleaseDate;
    const matchesGtDate = content.releaseDate.getTime() > new Date(filters.gtReleaseDate).getTime() || !filters.gtReleaseDate;

    return matchesLtDate && matchesGtDate;
  }

  private filterByContentType(filters: Filter, content: Content): boolean {
    return !!filters.contentTypes.has(content.type) || filters.contentTypes.size === 0;
  }
}
