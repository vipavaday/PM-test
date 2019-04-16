import { Filter } from './filter';

describe('Models: Filter', () => {
  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Filter()).not.toThrow();
    });

    it('should initialize contentTypes array', () => {
      expect(new Filter().contentTypes).not.toBeUndefined();
    });
  });

  describe('#toggleContentType', () => {

    let filter: Filter;

    beforeEach(() => {
      filter = new Filter();
    });

    it('should add content type', () => {
      filter.toggleContentType('tv');
      expect(filter.contentTypes.has('tv')).toEqual(true);
    });
  });
});
