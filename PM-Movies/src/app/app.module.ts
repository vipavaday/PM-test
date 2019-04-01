import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import {
  ContentRoutingModule,
  ThumbnailBoardModule,
} from '../modules/thumbnail-board';

import {
  AppComponent,
  HeaderComponent,
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ThumbnailBoardModule,
    ContentRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
