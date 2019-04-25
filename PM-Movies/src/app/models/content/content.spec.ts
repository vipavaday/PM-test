import { Content } from './content';

describe('Models: Content', () => {

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Content('', 42, new Date())).not.toThrow();
    });

    it('should create an instance when no title is given', () => {
      expect(() => new Content(undefined, 42, new Date())).not.toThrow();
    });

    it('should create an instance when no duration is given', () => {
      expect(() => new Content('', undefined, new Date())).not.toThrow();
    });

    it('should create an instance when no date is given', () => {
      expect(() => new Content('', 42, undefined)).not.toThrow();
    });

    it('should set title', () => {
      expect(new Content('test title', 42, new Date()).title).toEqual('test title');
    });

    it('should set duration', () => {
      expect(new Content('test title', 42, new Date()).duration).toEqual(42);
    });

    it('should set releaseDate', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).releaseDate).toEqual(new Date('2019-04-12'));
    });

    it('should set visible state', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).visible).toBe(true);
    });

    it('should initialize tmdbId when provided', () => {
      expect(new Content('test title', 42, new Date('2019-04-12'), 1456).tmdbId).toBe(1456);
    });

    it('should initialize backdrops array', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).backdrops).not.toBeUndefined();
    });

    it('should initialize cast array', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).cast).not.toBeUndefined();
    });

    it('should initialize directors array', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).directors).not.toBeUndefined();
    });

    it('should initialize originCountries array', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).originCountries).not.toBeUndefined();
    });

    it('should initialize genres array', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).genres).not.toBeUndefined();
    });
  });
});
