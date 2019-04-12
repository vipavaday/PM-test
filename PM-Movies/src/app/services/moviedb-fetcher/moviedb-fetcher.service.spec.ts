import { TestBed } from '@angular/core/testing';

import { MoviedbDataService } from './moviedb-fetcher.service';

describe('MoviedbFetcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoviedbDataService = TestBed.get(MoviedbDataService);
    expect(service).toBeTruthy();
  });
});
