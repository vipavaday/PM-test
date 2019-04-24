import { Cast } from './cast';

describe('Models: Cast', () => {
  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Cast()).not.toThrow();
    });

    it('should initialize cast person', () => {
      expect(new Cast().person).not.toBeUndefined();
    });
  });
});
