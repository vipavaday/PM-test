import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentThumbnailComponent } from './content-thumbnail/content-thumbnail.component';
import { ThumbnailBoardComponent } from './thumbnail-board.component';
import { MinutesToHoursPipe } from './content-thumbnail/minutes-to-hours.pipe';
import { ContentFiltersPanelComponent } from './content-filters-panel/content-filters-panel.component';
import { ContentDetailComponent } from './content-detail/content-detail.component';
import { ContentRoutingModule } from './content-routing.module';
import { HeaderComponent } from '../header/header.component';
import { SearchBarComponent } from '../header/search-bar/search-bar.component';


@NgModule({
  declarations: [
    ContentThumbnailComponent,
    ThumbnailBoardComponent,
    MinutesToHoursPipe,
    ContentFiltersPanelComponent,
    ContentDetailComponent,
    HeaderComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule
  ],
  entryComponents: [ThumbnailBoardComponent],
  exports: [
    ThumbnailBoardComponent,
    ContentThumbnailComponent,
    HeaderComponent
  ]
})
export class ThumbnailBoardModule { }
