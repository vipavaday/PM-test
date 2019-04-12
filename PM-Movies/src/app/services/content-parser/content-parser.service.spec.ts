import { TestBed } from '@angular/core/testing';

import { ContentParserService } from './content-parser.service';
import { Content } from 'src/app/models';

describe('ContentParserService', () => {
  let service: ContentParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ContentParserService ],
    });
    service = TestBed.get(ContentParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#parse', () => {
    beforeEach(() => {
      spyOn(service, 'parseTvShow').and.returnValue(new Content());
      spyOn(service, 'parseMovie').and.returnValue(new Content());
    });

    it('should redirect to parseTvShow', () => {
      service.parse({ media_type: 'tv', id: 42 }, 'test-picture', {  });
      expect(service.parseTvShow).toHaveBeenCalledWith({ media_type: 'tv', id: 42 }, {  }, 'test-picture', undefined);
    });

    it('should return a content object', () => {
      const result = service.parse({ media_type: 'tv', id: 42 }, 'test-picture', {  });
      expect(result).toEqual(jasmine.any(Content));
    });

    it('should transmit the content to parseTvShow', () => {
      const content = new Content();
      service.parse({ media_type: 'tv', id: 42 }, 'test-picture',  {  }, content);
      expect(service.parseTvShow).toHaveBeenCalledWith({ media_type: 'tv', id: 42 }, {  }, 'test-picture', new Content());
    });

    it('should redirect to parseMovie', () => {
      service.parse({ media_type: 'movie', id: 42 }, 'test-picture', {  }, undefined);
      expect(service.parseMovie).toHaveBeenCalledWith({ media_type: 'movie', id: 42 }, {  }, 'test-picture', undefined);
    });

    it('should transmit the content to parseMovie', () => {
      service.parse({ media_type: 'movie', id: 42 }, 'test-picture', {  }, new Content());
      expect(service.parseMovie).toHaveBeenCalledWith({ media_type: 'movie', id: 42 }, {  }, 'test-picture', new Content());
    });

    it('should do nothing', () => {
      const result = service.parse(<any>{ media_type: 'person', id: 42 }, 'test-picture',  {  }, new Content());
      expect(service.parseTvShow).not.toHaveBeenCalled();
      expect(service.parseMovie).not.toHaveBeenCalled();
      expect(result).toEqual(new Content());
    });
  });

  describe('#parseTvShow', () => {
    beforeEach(() => pending('TODO'));
  });

  describe('#parseMovie', () => {
    beforeEach(() => pending('TODO'));
  });

  describe('#parseCast', () => {
    beforeEach(() => pending('TODO'));
  });
});
