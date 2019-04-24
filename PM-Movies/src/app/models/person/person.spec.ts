import { Person } from './person';

describe('Models: Person', () => {
  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Person()).not.toThrow();
    });
  });
});
