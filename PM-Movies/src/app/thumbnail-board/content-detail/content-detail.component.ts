import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ContentDataService } from '../../content-data.service';
import { Content } from '../../content';
import { Cast } from './cast';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss']
})
export class ContentDetailComponent implements OnInit {

  id: string;

  type: string;

  content: Content;

  casts: Cast[];

  director: string;



  constructor(
    private contentDataProvider: ContentDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');

    this.contentDataProvider.getPosterBaseUrl().subscribe( ()=>{

      this.contentDataProvider.getContentDetail(this.type, this.id)
      .subscribe( content => {
        this.content = content;

        this.contentDataProvider.getContentCast(this.content)
        .subscribe( castsN => {
          this.casts = castsN;
        });

        this.contentDataProvider.getDirector(this.content).subscribe( dir => {
          this.director = dir;
        });
      });

    });
  }

  goBack() {
    this.router.navigate(['/thumbnail-board']);
  }

}
