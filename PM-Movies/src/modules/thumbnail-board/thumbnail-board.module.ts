import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ContentThumbnailComponent,
  ThumbnailBoardComponent,
  ContentFiltersPanelComponent,
  ContentDetailComponent,
} from './components';
import { MinutesToHoursPipe } from './pipes';
import { ContentRoutingModule } from './content-routing.module';

@NgModule({
  declarations: [
    ContentThumbnailComponent,
    ThumbnailBoardComponent,
    MinutesToHoursPipe,
    ContentFiltersPanelComponent,
    ContentDetailComponent,
  ],
  imports: [
    CommonModule,
    ContentRoutingModule
  ],
  entryComponents: [
    ThumbnailBoardComponent
  ],
  exports: [
    ThumbnailBoardComponent,
    ContentThumbnailComponent,
  ]
})
export class ThumbnailBoardModule { }
