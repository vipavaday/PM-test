import { Injectable } from '@angular/core';
import { Content, Cast } from 'src/app/models';
import { MDBTvShowJSON, MDBMovieJSON, MDBResultJSON, MDBCreditsJSON, MDBCastJSON, MDBPersonJSON } from './content-parser.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentParserService {
  public parse(json: MDBTvShowJSON | MDBMovieJSON | MDBPersonJSON,
    imgBaseUrl: string, credits?: MDBCreditsJSON, content?: Content): Content {

    switch (json.media_type) {
      case 'tv':
        return this.parseTvShow(json, credits, imgBaseUrl, content);
      case 'movie':
        return this.parseMovie(json, credits, imgBaseUrl, content);
    }

    return content;
  }

  // Partie specifique
  public parseTvShow(json: MDBTvShowJSON, credits: MDBCreditsJSON, imgBaseUrl: string, content = new Content()): Content {
    content.title = json.name;
    content.releaseDate = this.parseDate(json.first_air_date);
    content.duration = this.extractDuration(json.episode_run_time);

    content.directors = (!!json.created_by) ? json.created_by.map(creator => creator.name) : [];
    content.originCountries = json.origin_country;

    this.parseResult(json, credits, imgBaseUrl, content);

    return content;
  }

  public parseMovie(json: MDBMovieJSON, credits: MDBCreditsJSON, imgBaseUrl: string, content = new Content()): Content {
    content.title = json.original_title;
    content.releaseDate = this.parseDate(json.release_date);
    content.duration = json.runtime;

    const directors = (!!credits) ? credits.crew.filter(crewMember => crewMember.job === 'Director') : [];
    content.directors = directors.map(dir => dir.name);
    content.originCountries = (!!json.production_countries) ? json.production_countries.map(country => country.iso_3166_1) : [];

    this.parseResult(json, credits, imgBaseUrl, content);

    return content;
  }

  public parseCast(json: MDBCastJSON, imgBaseUrl: string, cast = new Cast()): Cast {
    cast.cast_id = json.cast_id;
    cast.character = json.character;
    cast.gender = json.gender;
    cast.name = json.name;
    cast.avatarPath = imgBaseUrl + json.profile_path;

    return cast;
  }

  private parseResult(json: MDBResultJSON, credits: MDBCreditsJSON, imgBaseUrl: string, content: Content): Content {
    content.tmdbId = json.id;
    content.type = json.media_type;
    content.posterUrl = (!!json.poster_path) ? imgBaseUrl + json.poster_path : null;
    content.voteAverage = json.vote_average;
    content.cast = this.getCasts(credits, imgBaseUrl);
    content.overview = json.overview;
    content.genres = (!!json.genres) ? json.genres.map(genre => genre.name) : [];

    return content;
  }


  private getCasts(credits: MDBCreditsJSON, imgBaseUrl: string): Cast[] {
    return (!!credits) ? credits.cast.map(json => this.parseCast(json, imgBaseUrl)) : [];
  }

  private extractDuration(durations: number[]): number {
    if (!Array.isArray(durations)) {
      return 0;
    }

    return Math.round(durations
      .reduce((a, b) => a + b, 0) / durations.length);
  }

  private parseDate(date: string): Date {
    const dateN = Date.parse(date);
    if (isNaN(dateN)) {
      return null;
    }

    return new Date(dateN);
  }
}
