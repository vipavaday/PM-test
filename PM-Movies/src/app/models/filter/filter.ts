export class Filter {

  private _gtReleaseDate = '';

  private _ltReleaseDate = '';

  public contentTypes: Set<string>;

  constructor() {
    this.contentTypes = new Set<string>();
    this.contentTypes.add('tv');
    this.contentTypes.add('movie');
  }

  public toggleContentType(contentType: string) {
    this.contentTypes.has(contentType) ? this.contentTypes.delete(contentType) : this.contentTypes.add(contentType);
  }

  set gtReleaseDate(date: string) {

    if (date !== '' && isNaN(Date.parse(date))) {
      throw new Error('#set gtReleaseDate: gtDate should follow dd/mm/yyyy formmat');
    }
    this._gtReleaseDate = date;
  }

  get gtReleaseDate(): string {
    return this._gtReleaseDate;
  }

  set ltReleaseDate(date: string) {

    if (date !== '' && isNaN(Date.parse(date))) {
      throw new Error('#set ltReleaseDate: ltDate should follow dd/mm/yyyy formmat');
    }
    this._ltReleaseDate = date;
  }

  get ltReleaseDate(): string {
    return this._ltReleaseDate;
  }
}
