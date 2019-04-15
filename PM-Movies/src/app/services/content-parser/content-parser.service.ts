import { Injectable } from '@angular/core';

import { Content } from 'src/app/models';
import {
  MDBTvShowJSON,
  MDBMovieJSON,
  MDBResultJSON,
  MDBContentImagesJSON
} from './content-parser.service.interface';

import {
  MDBCreditsJSON,
  MDBPersonJSON
} from '../people-parser';

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
    this.parseResult(json, credits, imgBaseUrl, content);

    content.type = 'tv';
    content.title = json.name;
    content.releaseDate = this.parseDate(json.first_air_date);
    content.duration = this.extractDuration(json.episode_run_time);

    content.directors = (!!json.created_by) ? json.created_by.map(creator => creator.name) : [];
    content.originCountries = json.origin_country;

    return content;
  }

  public parseMovie(json: MDBMovieJSON, credits: MDBCreditsJSON, imgBaseUrl: string, content = new Content()): Content {
    this.parseResult(json, credits, imgBaseUrl, content);

    content.type = 'movie';
    content.title = json.original_title;
    content.releaseDate = this.parseDate(json.release_date);
    content.duration = json.runtime;

    const directors = (!!credits) ? credits.crew.filter(crewMember => crewMember.job === 'Director') : [];
    content.directors = directors.map(dir => dir.name);
    content.originCountries = (!!json.production_countries) ? json.production_countries.map(country => country.iso_3166_1) : [];

    return content;
  }

  public parseContentImages(json: MDBContentImagesJSON, imgBaseUrl: string, contentImg: string[] = []): string[] {

    json.backdrops.map(backdrop => contentImg.push(imgBaseUrl + backdrop.file_path));
    return contentImg;
  }

  private parseResult(json: MDBResultJSON, credits: MDBCreditsJSON, imgBaseUrl: string, content: Content): Content {
    content.tmdbId = json.id;
    content.type = json.media_type;
    content.posterUrl = (!!json.poster_path) ? imgBaseUrl + json.poster_path : null;
    content.voteAverage = json.vote_average;
    content.overview = json.overview;
    content.genres = (!!json.genres) ? json.genres.map(genre => genre.name) : [];

    return content;
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
