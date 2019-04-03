import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ContentDataService } from '../../../../app/services/content-data';
import {
  Cast,
  Content
} from '../../../../app/models';
import { switchMap } from 'rxjs/operators';
import { zip } from 'rxjs/internal/observable/zip';
import { of, Subscription } from 'rxjs';

/**
* Represents a bunch of detail infos about a content
**/
@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss']
})
export class ContentDetailComponent implements OnInit, OnDestroy {

  id: string;

  type: string;

  content: Content;

  casts: Cast[];

  director: string;

  private subscription: Subscription;


  constructor(
    private contentDataProvider: ContentDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');

    this.subscription = this.contentDataProvider.getContentDetail(this.type, this.id)
      .pipe(switchMap(content => {
        const cast$ = this.contentDataProvider.getContentCast(content);
        const director$ = this.contentDataProvider.getDirector(content);

        return zip(of(content), cast$, director$);
      }))
      .subscribe(([content, casts, director]) => {
        this.content = content;
        this.casts = casts;
        this.director = director;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/thumbnail-board']);
  }

}
