import { Component, OnInit, Output, EventEmitter } from '@angular/core';

/**
* Represents the app header, present on every single page of the application
**/
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
