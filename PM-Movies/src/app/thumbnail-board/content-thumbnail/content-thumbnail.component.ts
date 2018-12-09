import { Component, OnInit, Input } from '@angular/core';

import { Content } from '../../content';

@Component({
  selector: 'app-content-thumbnail',
  templateUrl: './content-thumbnail.component.html',
  styleUrls: ['./content-thumbnail.component.scss']
})
export class ContentThumbnailComponent implements OnInit {

  @Input() content: Content;

  constructor() { }

  ngOnInit() {

  }

}
