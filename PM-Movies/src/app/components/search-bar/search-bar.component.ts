import {
  Component,
  OnInit,
} from '@angular/core';

import { QueryService } from '../../../modules/thumbnail-board';

/**
* Represents a searchbar able to notify others  of its update through the QueryService
**/
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  waitTime = 100;

  timeOut;

  constructor(private queryService: QueryService) { }

  ngOnInit() {
  }

  onSearchUpdate(searchQuery: string) {

    clearTimeout(this.timeOut);

    this.timeOut = setTimeout(() => {
      this.queryService.updateQuery(searchQuery);
    }, this.waitTime);

  }

}
