import { Injectable } from '@angular/core';

import {
  Content, Person
} from 'src/app/models';

import {
  MDBTvShowJSON,
  MDBMovieJSON,
  MDBResultJSON,
  MDBContentImagesJSON,
  MDBContentJSON,
  MDBSearchResponseJSON,
  IContentParser
} from './content-parser.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentParserService implements IContentParser {

  public parseContentList(response: MDBSearchResponseJSON, imgBaseUrl: string): Content[] {

    if (!response || !imgBaseUrl) {
      throw new Error('#parseContentList: response and imgBaseUrl parameters should not be undefined');
    }
    return response.results.map(res => this.parse(res, imgBaseUrl)).filter( content => content.type !== 'person');
  }

  public parse(json: MDBContentJSON, imgBaseUrl: string, content = new Content()): Content {
    if (!json) {
      throw new Error('#parse: json parameter should not be undefined');
    }

    return this.extractContentFromMediaType(json, imgBaseUrl, content);
  }

  // Partie specifique
  public parseTvShow(json: MDBTvShowJSON, imgBaseUrl: string, content = new Content()): Content {
    this.parseContentCommons(json, imgBaseUrl, content);

    content.type = 'tv';
    content.title = json.name;
    content.releaseDate = this.parseDate(json.first_air_date);
    content.duration = this.extractDuration(json.episode_run_time);

    content.directors = (!!json.created_by) ? json.created_by.map(creator => creator.name) : [];
    content.originCountries = json.origin_country;

    return content;
  }

  public parseMovie(json: MDBMovieJSON, imgBaseUrl: string, content = new Content()): Content {
    this.parseContentCommons(json, imgBaseUrl, content);

    content.type = 'movie';
    content.title = json.original_title;
    content.releaseDate = this.parseDate(json.release_date);
    content.duration = json.runtime;
    content.originCountries = (!!json.production_countries) ? json.production_countries.map(country => country.iso_3166_1) : [];

    return content;
  }

  public parseContentCommons(json: MDBResultJSON, imgBaseUrl: string, content = new Content()): Content {
    if (!json || !imgBaseUrl) {
      throw new Error('#parseContentCommons: json and imgBaseUrl parameters should not be undefined');
    }

    content.tmdbId = json.id;
    content.type = json.media_type;
    content.posterUrl = (!!json.poster_path) ? imgBaseUrl + json.poster_path : null;
    content.voteAverage = json.vote_average;
    content.overview = json.overview;
    content.genres = (!!json.genres) ? json.genres.map(genre => genre.name) : [];

    return content;
  }
  public parseContentImages(json: MDBContentImagesJSON, imgBaseUrl: string, content: Content = new Content()): string[] {

    if (!json || !imgBaseUrl) {
      throw new Error('#parseContentImages: json and imgBaseUrl parameters should not be undefined');
    }

    json.backdrops.map(backdrop => content.backdrops.push(imgBaseUrl + backdrop.file_path));
    return content.backdrops;
  }

  private extractContentFromMediaType(json: MDBContentJSON, imgBaseUrl: string, content: Content) {
    switch (json.media_type) {
      case 'tv':
        return this.parseTvShow(json, imgBaseUrl, content);
      case 'movie':
        return this.parseMovie(json, imgBaseUrl, content);
      case 'person':
        content.type = 'person';
        return content;
    }
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
