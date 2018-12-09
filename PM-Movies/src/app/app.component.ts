import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  title: string = 'PM-Movies';

  query: string;

  onSearchQueryUpdate(query: string){
    this.query = query;
  }
}
