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

    it('should set the title', () => {
      expect(new Content('test title', 42, new Date()).title).toEqual('test title');
    });

    it('should set the duration', () => {
      expect(new Content('test title', 42, new Date()).duration).toEqual(42);
    });

    it('should set the releaseDate', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).releaseDate).toEqual(new Date('2019-04-12'));
    });

    it('should set the visible state', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).visible).toBe(true);
    });

    it('should initialize the backdrop array', () => {
      expect(new Content('test title', 42, new Date('2019-04-12')).backdrops).not.toBeUndefined();
    });
  });
});
