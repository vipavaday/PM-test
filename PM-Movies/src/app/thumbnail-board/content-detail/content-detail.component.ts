import { Component, OnInit } from '@angular/core';

import { ContentDataService } from '../../content-data.service';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss']
})
export class ContentDetailComponent implements OnInit {

  constructor(private contentDataProvider: ContentDataService) { }

  ngOnInit() {
  }

}
