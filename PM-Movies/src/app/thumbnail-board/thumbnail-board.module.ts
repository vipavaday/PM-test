import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentThumbnailComponent } from './content-thumbnail/content-thumbnail.component';
import { ThumbnailBoardComponent } from './thumbnail-board.component';
import { MinutesToHoursPipe } from './content-thumbnail/minutes-to-hours.pipe';
import { ContentFiltersPanelComponent } from './content-filters-panel/content-filters-panel.component';

@NgModule({
  declarations: [
    ContentThumbnailComponent,
    ThumbnailBoardComponent,
    MinutesToHoursPipe,
    ContentFiltersPanelComponent
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [ThumbnailBoardComponent],
  exports: [
    ThumbnailBoardComponent,
    ContentThumbnailComponent
  ]
})
export class ThumbnailBoardModule { }
