
export abstract class Content {

  _type = '';

  _vote_average: number;

  _seen = false;

  _toWatch = false;

  private _tmdbId: number;

  private _title: string;

  private _posterUrl: string;

  private _duration: number;

  private _releaseDate: Date;

  private _visible: boolean;

  constructor(titleN: string, durationN: number, releaseDateN: Date) {

    this.title = titleN;
    this.duration = durationN;
    this.releaseDate = releaseDateN;
    this.visible = true;
  }

  abstract getDetailsRoute(): string;

  get visible(): boolean { return this._visible; }
  set visible(isVisible: boolean) { this._visible = isVisible; }

  get tmdbId(): number { return this._tmdbId; }
  set tmdbId(tmdbIdN: number) { this._tmdbId = tmdbIdN; }

  get title(): string { return this._title; }
  set title(titleN: string) { this._title = titleN; }

  get posterUrl(): string { return this._posterUrl; }
  set posterUrl(posterUrlN: string) { this._posterUrl = posterUrlN; }

  get duration(): number { return this._duration; }
  set duration(durationN: number) { this._duration = durationN; }

  get releaseDate(): Date { return this._releaseDate; }
  set releaseDate(releaseDateN: Date) { this._releaseDate = releaseDateN; }
}
