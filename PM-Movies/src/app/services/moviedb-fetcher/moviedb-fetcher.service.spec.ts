import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MoviedbDataService } from './moviedb-fetcher.service';

describe('Services: MoviedbFetcherService', () => {
  let service: MoviedbDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        MoviedbDataService,
      ],
    });

    service = TestBed.get(MoviedbDataService);
  });

  describe('#new', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('#getContentInfo', () => {
    // public getContentInfo(title: string): Observable<Content[]> {
    it('should support an undefined parameter', () => {
      expect(() => service.getContentInfo(undefined)).not.toThrow();
    });


    // it('should support an undefined parameter', () => {
    //   expect(service.getContentInfo(undefined)).();
    // });


  });

  describe('#getContentDetails', () => {
    beforeEach(() => pending('TODO'));
    // public getContentDetails(type: string, id: string): Observable<Content> {
  });
});
