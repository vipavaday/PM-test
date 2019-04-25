import { Cast } from '../cast';

export type ContentType = 'tv' | 'movie' | 'person';

export class Content {

  public type: ContentType;

  public voteAverage: number;

  public watched = false;

  public toWatch = false;

  public tmdbId: number;

  public title: string;

  public posterUrl: string;

  public duration: number;

  public releaseDate: Date;

  public visible: boolean;

  public overview: string;

  public backdrops: string[] = [];

  public cast: Cast[] = [];

  public directors: string[] = [];

  public originCountries: string[] = [];

  public genres: string[] = [];

  constructor(titleN?: string, durationN?: number, releaseDateN?: Date, tmdbId?: number) {

    this.title = titleN;
    this.duration = durationN;
    this.releaseDate = releaseDateN;
    this.visible = true;
    this.tmdbId = tmdbId;
  }
}
