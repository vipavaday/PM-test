import { Filter } from './filter';

describe('Models: Filter', () => {
  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Filter()).not.toThrow();
    });

    it('should initialize contentTypes set', () => {
      expect(new Filter().contentTypes).not.toBeUndefined();
    });

    it('should add tv as default enabled contentTypes filter', () => {
      expect(new Filter().contentTypes).toContain('tv');
    });

    it('should add movie as default enabled contentTypes filter', () => {
      expect(new Filter().contentTypes).toContain('movie');
    });
  });

  describe('#toggleContentType', () => {

    let filter: Filter;

    beforeEach(() => {
      filter = new Filter();
    });

    it('should add content type when missing', () => {
      filter.contentTypes.clear();
      filter.toggleContentType('tv');
      expect(filter.contentTypes.has('tv')).toEqual(true);
    });

    it('should remove content type when present', () => {
      filter.contentTypes.add('tv');
      filter.toggleContentType('tv');
      expect(filter.contentTypes.has('tv')).toEqual(false);
    });

    it('should remove only specified type', () => {
      filter.toggleContentType('movie');
      expect(filter.contentTypes.has('tv')).toEqual(true);
      expect(filter.contentTypes.has('movie')).toEqual(false);
    });
  });
});
