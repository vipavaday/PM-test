import { Filter } from './filter';

describe('Models: Filter', () => {
  let filter: Filter;

  beforeEach(() => {
    filter = new Filter();
  });

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

  describe('#set ltReleaseDate', () => {
    it('should throw an error when parameter is not parsable as a date', () => {
      expect(() => filter.ltReleaseDate = '82/24/1987')
      .toThrowError('#set ltReleaseDate: ltDate should follow dd/mm/yyyy formmat');
    });

    it('should set filter lower than date property', () => {
      filter.ltReleaseDate = '12/12/1987';
      expect(filter.ltReleaseDate).toBe('12/12/1987');
    });
  });

  describe('#set gtReleaseDate', () => {
    it('should throw an error when parameter is not parsable as a date', () => {
      expect(() => filter.gtReleaseDate = '82/24/1987')
      .toThrowError('#set gtReleaseDate: gtDate should follow dd/mm/yyyy formmat');
    });

    it('should set filter greater than date property', () => {
      filter.gtReleaseDate = '12/12/1987';
      expect(filter.gtReleaseDate).toBe('12/12/1987');
    });
  });
});
