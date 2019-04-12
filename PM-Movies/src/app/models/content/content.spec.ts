import { Content } from './content';

class TestContent extends Content {
  public getDetailsRoute(): string {
    return '';
  }
}

export function newContentSpecs(contentClass: any) {
  it('should create an instance', () => {
    expect(() => new contentClass('', 42, new Date())).not.toThrow();
  });

  it('should create an instance when no title is given', () => {
    expect(() => new contentClass(undefined, 42, new Date())).not.toThrow();
  });

  it('should create an instance when no duration is given', () => {
    expect(() => new contentClass('', undefined, new Date())).not.toThrow();
  });

  it('should create an instance when no date is given', () => {
    expect(() => new contentClass('', 42, undefined)).not.toThrow();
  });

  it('should set the title', () => {
    expect(new contentClass('test title', 42, new Date()).title).toEqual('test title');
  });

  it('should set the duration', () => {
    expect(new contentClass('test title', 42, new Date()).duration).toEqual(42);
  });

  it('should set the releaseDate', () => {
    expect(new contentClass('test title', 42, new Date('2019-04-12')).releaseDate).toEqual(new Date('2019-04-12'));
  });

  it('should set the visible state', () => {
    expect(new contentClass('test title', 42, new Date('2019-04-12')).visible).toBe(true);
  });
}

describe('Models: Content', () => {
  describe('#new', () => {
    newContentSpecs(TestContent);
  });
});
