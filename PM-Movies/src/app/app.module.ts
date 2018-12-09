import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ThumbnailBoardModule } from './thumbnail-board/thumbnail-board.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ThumbnailBoardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
