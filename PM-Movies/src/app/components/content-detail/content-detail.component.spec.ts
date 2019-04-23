import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import {of} from 'rxjs';

import {
  ContentFetcherService,
  ContentFetcherServiceMock
} from '../../services';

import { ContentDetailComponent } from './content-detail.component';
import { MinutesToHoursPipe } from 'src/app/pipes';
import { Content } from '../../models';

describe('Components: ContentDetailComponent', () => {
  let contentDetailComponent: ContentDetailComponent;
  let route: ActivatedRoute;
  let contentDataProvider: ContentFetcherService;

  console.log('param', convertToParamMap({
    'id': '5',
    'type': 'movie'
  }));
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentDetailComponent,
        MinutesToHoursPipe
      ],
      providers: [
        {
          provide: ContentFetcherService,
          useClass: ContentFetcherServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                'id': '5',
                'type': 'movie'
              })
            }
          }
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    route = TestBed.get(ActivatedRoute);
    contentDataProvider = TestBed.get(ContentFetcherService);
    const fixture = TestBed.createComponent(ContentDetailComponent);
    contentDetailComponent = fixture.debugElement.componentInstance;
  });

  describe('#new', () => {
    it('should create contentDetailComponent ', () => {
      expect(contentDetailComponent).toBeTruthy();
    });
  });

  describe('#ngOnInit', () => {
    let spyGetContentDetails: jasmine.Spy;
    let spyGetCastDetails: jasmine.Spy;
    let spyGetExtraImgs: jasmine.Spy;

    beforeEach(() => {
      spyGetContentDetails = spyOn(contentDataProvider, 'getContentDetails');
      spyGetContentDetails.and.returnValue(of(new Content('harry potter')));
      spyGetCastDetails = spyOn(contentDataProvider, 'getCastDetails');
      spyGetCastDetails.and.returnValue(of([]));
      spyGetExtraImgs = spyOn(contentDataProvider, 'getExtraImages');
      spyGetExtraImgs.and.returnValue(of([]));
    });

    it('should getContentDetail from service contentDetailComponent', () => {
      contentDetailComponent.ngOnInit();
      expect(spyGetContentDetails).toHaveBeenCalledWith('movie', 5);
    });

    it('should getCastDetail from service contentDetailComponent', () => {
      contentDetailComponent.ngOnInit();
      expect(spyGetCastDetails).toHaveBeenCalledWith(jasmine.objectContaining<Content>({
        title: 'harry potter'
      }));
    });

    it('should getExtraImages from service contentDetailComponent', () => {
      contentDetailComponent.ngOnInit();
      expect(spyGetExtraImgs).toHaveBeenCalledWith(jasmine.objectContaining<Content>({
        title: 'harry potter'
      }));
    });
  });

  describe('#getFormatedBiography', () => {

    it('should support undefined biography', () => {
      expect(() => contentDetailComponent.getFormatedBiography(undefined, 1)).not.toThrow();
    });

    it('should return empty string when biography undefined', () => {
      expect(contentDetailComponent.getFormatedBiography(undefined, 1)).toEqual('');
    });

    it('should throw an error if maxPhrase parameter is inferior to zero', () => {
      expect(() => contentDetailComponent.getFormatedBiography('phrase', -4))
      .toThrowError('#getFormatedBiography: maxPhrase parameter should neither be undefined nor negative');
    });

    it('should crop biography at maxphrase sentence based on punctuation', () => {
      expect(contentDetailComponent.getFormatedBiography(`Le vif zéphyr jubile sur les kumquats du clown gracieux.
      Voyez le brick géant que j'examine près du wharf.`, 1)).toEqual('Le vif zéphyr jubile sur les kumquats du clown gracieux.');
    });
  });

  describe('#getBackdropImg', () => {
    it('should return empty string when no backdrops', () => {
      expect(contentDetailComponent.getBackdropImg(0)).toBe('');
    });

    it('should return empty string when provided backdrop number is out of range', () => {
      contentDetailComponent.content = new Content();
      contentDetailComponent.content.backdrops = ['backdrop1.jpg'];
      expect(contentDetailComponent.getBackdropImg(1)).toBe('');
    });

    it('should return empty string when backdrop path contains null', () => {
      contentDetailComponent.content = new Content();
      contentDetailComponent.content.backdrops = ['http://null/backdrop1.jpg'];
      expect(contentDetailComponent.getBackdropImg(0)).toBe('');
    });

    it('should return content backdrops path', () => {
      contentDetailComponent.content = new Content();
      contentDetailComponent.content.backdrops = ['http://tmdb/backdrop1.jpg'];
      expect(contentDetailComponent.getBackdropImg(0)).toBe('http://tmdb/backdrop1.jpg');
    });
  });
});
