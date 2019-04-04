import { Content } from '../content';

export class Movie extends Content {

  constructor(titleN: string, durationN: number, releaseDateN: Date) {

    super(titleN, durationN, releaseDateN);
    this.type = 'movie';
  }
}
