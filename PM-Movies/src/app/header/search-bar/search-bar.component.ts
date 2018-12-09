import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Output() queryUpdate: EventEmitter<string> = new EventEmitter();

  waitTime: number = 300;

  timeOut;

  constructor() { }

  ngOnInit() {
  }

  onSearchUpdate(searchQuery: string){

    clearTimeout(this.timeOut);

    this.timeOut = setTimeout(()=>{
      this.queryUpdate.emit(searchQuery);
    }, this.waitTime);

  }

}
