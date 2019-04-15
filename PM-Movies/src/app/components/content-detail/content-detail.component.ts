import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { Subscription } from 'rxjs';

import {
  ContentFetcherService,
  ContentListStateService
} from '../../services';

import { Content, Cast } from '../../models';
import {
  map,
  switchMap,
} from 'rxjs/operators';

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

  public type: string;

  public content: Content;

  public director: string;

  private subscription: Subscription;


  constructor(
    private contentDataProvider: ContentFetcherService,
    private route: ActivatedRoute,
    private router: Router,
    private queryService: ContentListStateService
  ) { }

  public ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.type = this.route.snapshot.paramMap.get('type');

    this.subscription = this.contentDataProvider.getContentDetails(this.id, this.type).pipe(
      switchMap(content => this.contentDataProvider.getCastDetails(content).pipe(map(cast => ({ cast, content })))),
      switchMap(res => this.contentDataProvider.getExtraImages(res.content).pipe(map(cast => res)))
    ).subscribe(result => {
      this.content = result.content;
      this.content.cast = result.cast;
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public goBack() {

    this.queryService.updateQuery('');
    this.router.navigate(['/thumbnail-board']);
  }

  public getFormatedBiography(biography: string, maxPhrase: number): string {
    if (!biography) {
      return '';
    }

    return biography.split('.').slice(0, maxPhrase).join('.') + '.';
  }

  public getBackdropImg(backdropNo: number): string {

    if (!this.content.backdrops || this.content.backdrops.length <= backdropNo) {
      return '';
    }

    return (this.content.backdrops[backdropNo].includes('null')) ? '' : this.content.backdrops[backdropNo];
  }

}
