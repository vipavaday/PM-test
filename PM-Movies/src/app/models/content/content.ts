import { Cast } from '../cast';

export abstract class Content {

  public type = '';

  public voteAverage: number;

  public watched = false;

  public toWatch = false;

  public tmdbId: number;

  public title: string;

  public posterUrl: string;

  public duration: number;

  public releaseDate: Date;

  public visible: boolean;

  public posterPath: string;

  public overview: string;

  public cast: Cast[];

  public directors: string[];

  public originCountries: string[];

  public genres: string[];

  constructor(titleN: string, durationN: number, releaseDateN: Date) {

    this.title = titleN;
    this.duration = durationN;
    this.releaseDate = releaseDateN;
    this.visible = true;
  }
}
