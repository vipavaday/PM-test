import { TestBed } from '@angular/core/testing';

import { ContentListStateService } from './content-state.service';

describe('ContentListStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentListStateService = TestBed.get(ContentListStateService);
    expect(service).toBeTruthy();
  });
});
