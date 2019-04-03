
export abstract class Content {

  public type = '';

  public vote_average: number;

  public seen = false;

  public toWatch = false;

  public tmdbId: number;

  public title: string;

  public posterUrl: string;

  public duration: number;

  public releaseDate: Date;

  public visible: boolean;

  constructor(titleN: string, durationN: number, releaseDateN: Date) {

    this.title = titleN;
    this.duration = durationN;
    this.releaseDate = releaseDateN;
    this.visible = true;
  }

  public abstract getDetailsRoute(): string;
}
