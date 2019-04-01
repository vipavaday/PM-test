import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import {
  ContentDetailComponent,
  ThumbnailBoardComponent,
 } from './components';


const routes: Routes = [
  { path: 'thumbnail-board', component: ThumbnailBoardComponent },
  { path: 'detail/:type/:id', component: ContentDetailComponent },
  { path: '',   redirectTo: '/thumbnail-board', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ContentRoutingModule { }
