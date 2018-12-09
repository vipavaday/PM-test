import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes }  from '@angular/router';

import {ThumbnailBoardComponent} from './thumbnail-board.component';
import {ContentDetailComponent} from './content-detail/content-detail.component';


const routes: Routes = [
  { path: 'thumbnail-board', component: ThumbnailBoardComponent },
  { path: 'detail',        component: ContentDetailComponent },
  { path: '',   redirectTo: '/thumbnail-board', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ContentRoutingModule { }
