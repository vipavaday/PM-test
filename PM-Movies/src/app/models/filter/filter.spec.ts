import { Filter } from './filter';

describe('Models: Filter', () => {
  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Filter()).not.toThrow();
    });

    it('should initialize contentTypes set', () => {
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

    it('should remove content type', () => {
      filter.toggleContentType('tv');
      filter.toggleContentType('tv');
      expect(filter.contentTypes.has('tv')).toEqual(false);
    });

    it('should not remove content type if another is added', () => {
      filter.toggleContentType('tv');
      filter.toggleContentType('movie');
      expect(filter.contentTypes.has('tv')).toEqual(true);
      expect(filter.contentTypes.has('movie')).toEqual(true);
    });

    it('should remove only specified type', () => {
      filter.toggleContentType('tv');
      filter.toggleContentType('movie');
      filter.toggleContentType('movie');
      expect(filter.contentTypes.has('tv')).toEqual(true);
      expect(filter.contentTypes.has('movie')).toEqual(false);
    });
  });
});
