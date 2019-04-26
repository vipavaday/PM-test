import { Person } from '../person';

export class Cast {

  public cast_id: number;

  public character = '';

  public person: Person;

  constructor() {
    this.person = new Person();
  }
}
