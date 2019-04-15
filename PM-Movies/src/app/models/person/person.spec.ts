import { Cast } from './person';

describe('Models: Person', () => {
  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Cast()).not.toThrow();
    });
  });
});
