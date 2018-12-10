import { Injectable , OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Content } from './content';
import { Movie } from './movie';
import { TvShow } from './tv-show';
import { Config } from './config';
import { Cast } from './thumbnail-board/content-detail/cast';

/**
* Gets data about contents (Movie, Tv Show) from the TMDB API and localStorage
**/
@Injectable({
  providedIn: 'root'
})
export class ContentDataService implements OnInit{

  private readonly apiKey = '?api_key=422113b1d8f5bb170e051db92b9e84b5';

  private readonly baseUrl: string = 'https://api.themoviedb.org/3';

  private imgBaseUrl: string;

  private lastConfigUpdate: Date;


  constructor(private http: HttpClient) {

    this.lastConfigUpdate = new Date();
  }

  ngOnInit() {
  }

  /**
  * Retrieves the baseUrl configuration for the image paths returned by the TMDB API
  **/
  getPosterBaseUrl(): Observable<string>{

    if( this.imgBaseUrl == undefined || daysBetween( this.lastConfigUpdate, new Date()) > 2){

      this.http.get<Config>(this.baseUrl +'/configuration'+this.apiKey).subscribe( data => {

        this.imgBaseUrl = data.images['base_url']+'/original/';

        return this.imgBaseUrl;
      });
    }

    return of<string>( this.imgBaseUrl );
  }

  /**
  * Searches for content of any type matching the provided string (title)
  **/
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
              new Date((res["release_date"]=='')?new Date(800, 12):res["release_date"])
            );

          }else if (res["media_type"] == 'tv'){

            content = new TvShow(
             res["name"],
             0,
             new Date((res["first_air_date"]=='')?new Date(800, 12): res["first_air_date"])
           );
          }


          content.tmdbId = res["id"];
          content.posterUrl = this.imgBaseUrl + res["poster_path"];
          content._seen = this.isSeen(content);
          content._toWatch = this.isToWatch(content);

          this.getContentDuration(content).subscribe(duration => content.duration = duration);

          return content;
        });
      }));
  }

  /**
  * Retrieves some information about a TV Show or Movie
  **/
  getContentDetail(type: string, id: string):Observable<Content>{

    return this.http.get(this.baseUrl + '/'+type+'/'+id+this.apiKey)
    .pipe( map( res =>{

        let content: Content;

        if(type =='movie'){

          content = new Movie(
           res["original_title"],
           0,
           new Date((res["release_date"]=='')?new Date(800, 12):res["release_date"])
         );

        }else if(type =='tv'){

          content = new TvShow(
           res["name"],
           0,
           new Date((res["first_air_date"]=='')?new Date(800, 12):res["first_air_date"])
         );
        }

        content.tmdbId = res["id"];
        content.posterUrl = this.imgBaseUrl + res["poster_path"];
        content._vote_average = res["vote_average"];

        this.getContentDuration(content).subscribe(duration => content.duration = duration);

        return content;

    }));
  }

  /**
  *  Retrieves the runtime of a movie or the average runtime of the episodes of a tv show
  */
  getContentDuration(content: Content): Observable<number>{

    return this.http.get(this.baseUrl +content.getDetailsRoute()+this.apiKey)
    .pipe( map( data =>{
      if( content instanceof Movie){
          return data["runtime"];
      }else if( content instanceof TvShow){

        return Math.round(data["episode_run_time"]
        .reduce((a,b)=> a+b, 0)/data["episode_run_time"].length);
      }

    }));
  }

  /**
  * Retrieves the cast of the movie or TV Show
  **/
  getContentCast(content: Content): Observable<Cast[]>{

    return this.http.get(this.baseUrl + content.getDetailsRoute()+'/credits'+this.apiKey)
    .pipe( map( data =>{

      return data["cast"].map( castObj => {

        let cast:Cast = new Cast();
        cast.cast_id = castObj["cast_id"];
        cast.character = castObj["character"];
        cast.gender = castObj["gender"];
        cast.name = castObj["name"];

        return cast;
      });

    }));
  }

  /**
  * Retrieves the director of a movie or Tv Show
  */
  getDirector(content: Content): Observable<string>{

    return this.http.get(this.baseUrl + content.getDetailsRoute()+'/credits'+this.apiKey)
    .pipe( map( data =>{
      let dir = data["crew"].filter(crewMember => crewMember["job"]=='Director');
      return (dir.length >0)?dir[0]["name"]: 'Unknown';

    }));
  }

  /**
  * Checks in the localStorage whether the content has been marked as seen
  */
  isSeen(content: Content):boolean{

    return localStorage.getItem(content.tmdbId+'_seen') == 'true';
  }

  /**
  * Checks in the localStorage whether the content is to be watched
  */
  isToWatch(content: Content):boolean{

    return localStorage.getItem(content.tmdbId+'_watch') == 'true';
  }

  /**
  * If not already there, adds a content to watch in the localStorage
  */
  addToWatchList(content: Content){

    if(!localStorage.getItem(content.tmdbId+'_watch')){
      localStorage.setItem(content.tmdbId+'_watch', 'true');
    }
  }

  /**
  * If exists, removes a content to watch from the localStorage
  */
  removeFromWatchList(content: Content){

    if(!localStorage.getItem(content.tmdbId+'_watch')){
      localStorage.removeItem(content.tmdbId+'_watch');
    }
  }

  /**
  * If not already there, adds a content to see in the localStorage
  */
  addToSeenContent(content: Content){

    if(!localStorage.getItem(content.tmdbId+'_seen')){
      localStorage.setItem(content.tmdbId+'_seen', 'true');
    }
  }

  /**
  * If exists, removes a content to see from the localStorage
  */
  removeFromSeenContent(content: Content){

    if(!localStorage.getItem(content.tmdbId+'_seen')){
      localStorage.removeItem(content.tmdbId+'_seen');
    }
  }


}

/**
* Works out the number of days between two js Dates
**/
let daysBetween = function(date1: Date, date2: Date): number{

  let dayInMs = 1000*60*60*24;

  return Math.round( Math.abs( date1.getTime() - date2.getTime() ) / dayInMs);

}
