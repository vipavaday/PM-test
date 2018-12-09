import { TestBed } from '@angular/core/testing';

import { ContentDataService } from './content-data.service';

describe('ContentDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentDataService = TestBed.get(ContentDataService);
    expect(service).toBeTruthy();
  });
});
