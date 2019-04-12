export class Filter {

  public gtReleaseDate = '';

  public ltReleaseDate = '';

  public contentTypes;

  constructor() {
    this.contentTypes = new Set<string>();
  }

  public toggleContentType(contentType: string) {
    this.contentTypes.has(contentType) ? this.contentTypes.delete(contentType) : this.contentTypes.add(contentType);
  }
}
