import { TestBed } from '@angular/core/testing';
import { ContentListStateService } from '.';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('Services: ContentListStateService', () => {
  let contentListStateService: ContentListStateService;
  let router: Router;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        ContentListStateService,
      ]
    });

    router = testBed.get(Router);
    contentListStateService = testBed.get(ContentListStateService);
  });

  describe('#new', () => {
    it('should be created', () => {
      expect(contentListStateService).toBeTruthy();
    });

    it('should expose a query behavior subject', () => {
      expect(contentListStateService.queryUpdatedSource).toBeTruthy();
    });

    it('should expose a query observable', () => {
      expect(contentListStateService.queryUpdated$).toBeTruthy();
    });

    it('should update queryUpdated$ when queryUpdatedSource emits a new value', done => {
      contentListStateService.queryUpdated$.subscribe(queryItem => {
        expect(queryItem).toBe('Kingdom of Heaven');
        done();
      }, () => fail());
      contentListStateService.queryUpdatedSource.next('Kingdom of Heaven');
    });

    it('should debounce query subject update', done => {
      contentListStateService.queryUpdated$.subscribe(queryItem => {
        expect(queryItem).toBe('Home Alone');
        done();
      }, () => fail());
      contentListStateService.queryUpdatedSource.next('Kingdom of Heaven');
      contentListStateService.queryUpdatedSource.next('The Simpsons');
      contentListStateService.queryUpdatedSource.next('Home Alone');
    });
  });

  describe('#updateQuery', () => {
    beforeEach(() => {
      spyOn(router, 'navigate');
    });

    it('should support undefined query parameter', () => {
      expect(() => contentListStateService.updateQuery(undefined)).not.toThrow();
    });

    it('should call router navigate method', () => {
      contentListStateService.updateQuery('Shutter Island');
      expect(router.navigate)
      .toHaveBeenCalledWith(jasmine.arrayWithExactContents(['/thumbnail-board']));
    });

    it('should emit new query value on queryUpdatedSource', done => {
      contentListStateService.queryUpdated$.subscribe(queryItem => {
        expect(queryItem).toBe('Shutter Island');
        done();
      }, () => fail());
      contentListStateService.updateQuery('Shutter Island');
    });

    it('should emit last query value on queryUpdatedSource when new query is empty', done => {
      contentListStateService.updateQuery('Shutter Island');
      contentListStateService.queryUpdated$.subscribe(queryItem => {
        expect(queryItem).toBe('Shutter Island');
        done();
      }, () => fail());
      setTimeout(() => contentListStateService.updateQuery(''), 500);
    });

    it('should have empty string as last query value when first called', done => {
      contentListStateService.queryUpdated$.subscribe(queryItem => {
        expect(queryItem).toBe('');
        done();
      }, () => fail());
      contentListStateService.updateQuery('');
    });
  });
});
