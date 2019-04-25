import { TestBed } from '@angular/core/testing';
import { FilterManagerService } from './filter-manager.service';
import { Filter, Content } from 'src/app/models';

describe('Services: FilterManagerService', () => {
  let filterService: FilterManagerService;
  let filter: Filter;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      providers: [
        FilterManagerService
      ]
    });

    filterService = testBed.get(FilterManagerService);
    filter = new Filter();
  });

  describe('#new', () => {
    it('should be created', () => {
      expect(filterService).toBeTruthy();
    });

    it('should expose a filter replay subject', () => {
      expect(filterService.filtersUpdateSource).toBeTruthy();
    });

    it('should expose a filter observable', () => {
      expect(filterService.$filtersUpdated).toBeTruthy();
    });

    it('should update $filtersUpdated when filtersUpdateSource emits a new value', done => {
      filter.gtReleaseDate = '04/08/1976';
      filterService.$filtersUpdated.subscribe(itemFilter => {
        expect(itemFilter.gtReleaseDate).toBe('04/08/1976');
        done();
      }, () => fail());
      filterService.filtersUpdateSource.next(filter);
    });
  });

  describe('#filterContents', () => {
    let contents: Content[];

    beforeEach(() => {
      contents = [];
      contents.push(new Content('a', 145, new Date('02/03/2004')));
      contents.push(new Content('b', 25, new Date('08/11/2018')));
      contents.push(new Content('c', 120, new Date('01/06/1994')));
      contents[0].type = 'tv';
      contents[1].type = 'movie';
      contents[2].type = 'movie';
    });

    it('should throw an error when filters parameter is undefined', () => {
      expect(() => filterService.filterContents(undefined, []))
        .toThrowError('#filterContents: filters or contents parameter should not be undefined');
    });

    it('should throw an error when filters parameter is undefined', () => {
      expect(() => filterService.filterContents(new Filter(), undefined))
        .toThrowError('#filterContents: filters or contents parameter should not be undefined');
    });

    it('should return contents that match minimum date filter criteria', () => {
      filter.gtReleaseDate = '12/12/2015';
      expect(filterService.filterContents(filter, contents).filter(item => item.visible === true))
        .toEqual(jasmine.arrayWithExactContents([
          <any>jasmine.objectContaining<Content>({
            title: 'b',
            duration: 25,
            releaseDate: new Date('08/11/2018')
          })
        ])
        );

    });

    it('should return contents that match maximum date filter criteria', () => {
      filter.ltReleaseDate = '12/12/2000';
      expect(filterService.filterContents(filter, contents).filter(item => item.visible === true))
        .toEqual(jasmine.arrayWithExactContents([
          <any>jasmine.objectContaining<Content>({
            title: 'c',
            duration: 120,
            releaseDate: new Date('01/06/1994')
          })
        ])
        );
    });

    it('should return contents that match date range filter criteria', () => {
      filter.gtReleaseDate = '12/12/2000';
      filter.ltReleaseDate = '12/12/2017';
      expect(filterService.filterContents(filter, contents).filter(item => item.visible === true))
        .toEqual(jasmine.arrayWithExactContents([
          <any>jasmine.objectContaining<Content>({
            title: 'a',
            duration: 145,
            releaseDate: new Date('02/03/2004')
          })
        ])
        );
    });

    it('should not filter on date when empty date criteria is provided', () => {
      expect(filterService.filterContents(filter, contents).filter(item => item.visible === true).length)
        .toBe(3);
    });

    describe('should return contents that match content type criteria', () => {
      it('when filtered type is tv show', () => {
        filter.contentTypes.delete('movie');
        expect(filterService.filterContents(filter, contents).filter(item => item.visible === true))
          .toEqual(jasmine.arrayWithExactContents([
            <any>jasmine.objectContaining<Content>({
              title: 'a',
              duration: 145,
              releaseDate: new Date('02/03/2004')
            })
          ])
          );
      });

      it('when filtered type is movie', () => {
        filter.contentTypes.delete('tv');
        expect(filterService.filterContents(filter, contents).filter(item => item.visible === true))
          .toEqual(jasmine.arrayWithExactContents([
            <any>jasmine.objectContaining<Content>({
              title: 'b',
              duration: 25,
              releaseDate: new Date('08/11/2018')
            }),
            jasmine.objectContaining<Content>({
              title: 'c',
              duration: 120,
              releaseDate: new Date('01/06/1994')
            })
          ]));
      });
    });

    it('should not filter on type when content type criteria is empty', () => {
      expect(filterService.filterContents(filter, contents).filter(item => item.visible === true).length)
        .toBe(3);
    });

    it('should be able to combine content type and date filters', () => {
      filter.contentTypes.delete('tv');
      filter.ltReleaseDate = '09/11/2001';
      expect(filterService.filterContents(filter, contents).filter(item => item.visible === true))
        .toEqual(jasmine.arrayWithExactContents([
          <any>jasmine.objectContaining<Content>({
            title: 'c',
            duration: 120,
            releaseDate: new Date('01/06/1994')
          })
        ]));
    });
  });
});
