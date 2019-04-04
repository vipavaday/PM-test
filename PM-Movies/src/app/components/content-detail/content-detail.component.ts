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
  ContentDataService,
  QueryService
} from '../../services';

import { Content } from '../../models';

/**
* Represents a bunch of detail infos about a content
**/
@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss']
})
export class ContentDetailComponent implements OnInit, OnDestroy {

  public id: string;

  public type: string;

  public content: Content;

  public director: string;

  private subscription: Subscription;


  constructor(
    private contentDataProvider: ContentDataService,
    private route: ActivatedRoute,
    private router: Router,
    private queryService: QueryService
  ) { }

  public ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');

    this.subscription = this.contentDataProvider.getContentDetails(this.type, this.id)
      .subscribe(content => {
        this.content = content;
      });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public goBack() {

    this.queryService.updateQuery('');
    this.router.navigate(['/thumbnail-board']);
  }

}
