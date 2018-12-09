import { Injectable , OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Content } from './content';
import { Movie } from './movie';
import { TvShow } from './tv-show';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ContentDataService implements OnInit{

  private readonly apiKey = '?api_key=422113b1d8f5bb170e051db92b9e84b5';

  private readonly baseUrl: string = 'https://api.themoviedb.org/3';

  private imgBaseUrl: string;

  private lastConfigUpdate: Date;


  constructor(private http: HttpClient) { }

  ngOnInit() {

  }


  getPosterBaseUrl(): Observable<string>{

    if( this.imgBaseUrl == undefined || daysBetween( this.lastConfigUpdate, new Date()) > 2){

      this.http.get<Config>(this.baseUrl +'/configuration'+this.apiKey).subscribe( data => {

        this.imgBaseUrl = data.images['base_url']+'/original/';

        return this.imgBaseUrl;
      });
    }

    return of<string>( this.imgBaseUrl );
  }

  searchInfoForContent(title: string): Observable<Content[]>{

    return this.http.get(
      this.baseUrl+'/search/multi'+this.apiKey+'&query='+encodeURI(title)
    ).pipe( map( data => {

        return data["results"]
        .filter( res => res["media_type"] == 'movie' || res["media_type"] == 'tv')
        .map( res => {

          let content: Content;

          if(res["media_type"] == 'movie'){

             content = new Movie(
              res["original_title"],
              0,
              new Date(res["release_date"])
            );
          }else if (res["media_type"] == 'tv'){

            content = new TvShow(
             res["name"],
             0,
             new Date(res["first_air_date"])
           );
          }


          content.tmdbId = res["id"];
          content.posterUrl = this.imgBaseUrl + res["poster_path"];

          this.getContentDuration(content).subscribe(duration => content.duration = duration);

          return content;
        });
      }));
  }

  getContentDuration(content: Content): Observable<number>{

    return this.http.get(this.baseUrl +content.getDetailsRoute()+this.apiKey)
    .pipe( map( data =>{
      if( content instanceof Movie){
          return data["runtime"];
      }else if( content instanceof TvShow){
        console.log(data["episode_run_time"]);
        return Math.round(data["episode_run_time"].reduce((a,b)=> a+b)/data["episode_run_time"].length);
      }

    }));
  }
}

let daysBetween = function(date1: Date, date2: Date): number{

  let dayInMs = 1000*60*60*24;

  return Math.round( Math.abs( date1.getTime() - date2.getTime() ) / dayInMs);

}
