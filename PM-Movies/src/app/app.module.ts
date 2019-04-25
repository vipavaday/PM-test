import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AppComponent,
  HeaderComponent,
  SearchBarComponent,
  ThumbnailBoardComponent,
  ContentDetailComponent,
  ContentFiltersPanelComponent,
  ContentThumbnailComponent,
} from './components';
import { ContentRoutingModule } from './app-routing.module';
import { MinutesToHoursPipe } from './pipes';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchBarComponent,
    ThumbnailBoardComponent,
    ContentDetailComponent,
    ContentFiltersPanelComponent,
    ContentThumbnailComponent,
    MinutesToHoursPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ContentRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
