import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  map,
  switchMap,
} from 'rxjs/operators';

import { ContentFetcherService } from '../../services';

import {
  Content,
  ContentType
} from '../../models';

/**
* Represents a bunch of detail infos about a content
**/
@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss']
})
export class ContentDetailComponent implements OnInit, OnDestroy {

  public id: number;

  public type: ContentType;

  public content: Content;

  public director: string;

  private subscription: Subscription;

  constructor(
    private contentDataProvider: ContentFetcherService,
    private route: ActivatedRoute
  ) { }

  public ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.type = <ContentType>this.route.snapshot.paramMap.get('type');

    this.subscription = this.contentDataProvider.getContentDetails(this.type, this.id).pipe(
      switchMap(content => this.contentDataProvider.getCastDetails(content).pipe(map(cast => ({ cast, content })))),
      switchMap(res => this.contentDataProvider.getExtraImages(res.content).pipe(map(() => res)))
    ).subscribe(result => {
      this.content = result.content;
      this.content.cast = result.cast;
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public getFormatedBiography(biography: string, maxPhrase: number): string {
    if (!biography) {
      return '';
    }

    if (!maxPhrase || maxPhrase < 0) {
      throw new Error('#getFormatedBiography: maxPhrase parameter should neither be undefined nor negative');
    }

    return biography.split('.').slice(0, maxPhrase).join('.') + '.';
  }

  public getBackdropImg(backdropNo: number): string {

    if (!this.content || !this.content.backdrops || this.content.backdrops.length <= backdropNo) {
      return '';
    }

    return (this.content.backdrops[backdropNo].includes('null')) ? '' : this.content.backdrops[backdropNo];
  }

}
