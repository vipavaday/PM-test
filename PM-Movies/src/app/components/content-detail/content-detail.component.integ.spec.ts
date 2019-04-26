import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createHostComponentFactory,
  HostComponentFactory,
  SpectatorWithHost
} from '@pm/spectator';

import {
  ContentFetcherService,
  ContentFetcherServiceMock
} from '../../services';

import { DebugElement } from '@angular/core';
import { Cast, Content } from '../../models';
import { MinutesToHoursPipe } from '../../pipes';
import { ContentDetailComponent } from './content-detail.component';

describe('Component : ContentDetailComponent', () => {
  let createHost: HostComponentFactory<ContentDetailComponent>;
  let host: SpectatorWithHost<ContentDetailComponent>;

  beforeEach(() => {
    createHost = createHostComponentFactory({
      component: ContentDetailComponent,
      shallow: true,
      declarations: [
        MinutesToHoursPipe
      ],
      providers: [
        { provide: ContentFetcherService, useClass: ContentFetcherServiceMock }
      ],
      imports: [
        RouterTestingModule
      ],
    });
  });

  it('should render', () => {
    host = createHost('<app-content-detail></app-content-detail>');
    expect(host.getDirectiveInstance('app-content-detail')).toBeTruthy();
  });

  describe('component content', () => {
    beforeEach(() => {
      host = createHost('<app-content-detail></app-content-detail>');
    });

    describe('%DetailContainer: ', () => {
      it('should not be displayed when content is undefined', () => {
        host.component.content = undefined;
        host.detectChanges();
        expect(host.debugElement.query(By.css('.detail-container'))).toBeFalsy();
      });

      it('should be displayed when content is defined', () => {
        expect(host.debugElement.query(By.css('.detail-container'))).toBeTruthy();
      });
    });

    describe('%Title: ', () => {
      it('should display content title', () => {
        host.component.content = new Content('Harry Potter');
        host.detectChanges();
        const elem: HTMLElement = host.debugElement.query(By.css('.jumbotron-title')).nativeElement;
        expect(elem.textContent).toContain('Harry Potter');
      });
    });


    describe('%ReleaseDate: ', () => {
      describe('when release date is missing', () => {
        it('should not display .release-date-block', () => {
          expect(host.debugElement.query(By.css('.release-date-block'))).toBeFalsy();
        });

        it('should display .release-date-error', () => {
          expect(host.debugElement.query(By.css('.release-date-error'))).toBeTruthy();
        });
      });

      describe('when release date is provided', () => {
        beforeEach(() => {
          host.component.content = new Content('Dune', 190, new Date(1987, 6, 5));
          host.detectChanges();
        });

        it('should contain formated content release date in .content-release-date', () => {
          const elem: HTMLElement = host.debugElement.query(By.css('.content-release-date')).nativeElement;
          expect(elem.textContent).toContain('05 July 1987');
        });

        it('should not display .release-date-error', () => {
          host.detectChanges();
          expect(host.debugElement.query(By.css('.release-date-error'))).toBeFalsy();
        });
      });
    });

    describe('%Duration', () => {
      describe('when correct duration is provided', () => {
        it('should contain content formated duration in .content-duration', () => {
          host.component.content = new Content('The wizard of Oz', 125);
          host.detectChanges();
          const elem: HTMLElement = host.debugElement.query(By.css('.content-duration')).nativeElement;
          expect(elem.textContent).toEqual(' 2 h 05 ');
        });
      });

      describe('when content duration is invalid', () => {
        it('should display .duration-error', () => {
          host.component.content = new Content('The wizard of Oz');
          host.detectChanges();
          expect(host.debugElement.query(By.css('.duration-error'))).toBeTruthy();
        });
      });
    });

    describe('%Genres: ', () => {
      describe('when content genres are provided', () => {
        it('should contain content genres separed by comas in .content-genres', () => {
          host.component.content.genres = ['sci-fi', 'horror', 'thriller'];
          host.detectChanges();
          const elem: HTMLElement = host.debugElement.query(By.css('.content-genres')).nativeElement;
          expect(elem.textContent).toEqual(' sci-fi, horror, thriller ');
        });
      });

      describe('when content genres are missing', () => {
        it('should display .genres-error', () => {
          host.detectChanges();
          expect(host.debugElement.query(By.css('.genres-error'))).toBeTruthy();
        });
      });
    });

    describe('%Director: ', () => {
      describe('when content directors are missing', () => {
        it('should display .directors-error', () => {
          host.detectChanges();
          expect(host.debugElement.query(By.css('.directors-error'))).toBeTruthy();
        });

        it('should not display .directors-name-row', () => {
          expect(host.debugElement.query(By.css('.directors-name-row'))).toBeFalsy();
        });
      });

      describe('when less than 3 content directors are provided', () => {
        beforeEach(() => {
          host.component.content.directors = ['Alphonso Cuaron', 'James Cameron'];
          host.detectChanges();
        });

        it('should contain content directors in .directors-name-row', () => {
          const elem: HTMLElement = host.debugElement.query(By.css('.directors-name-row')).nativeElement;
          expect(elem.textContent).toEqual('Alphonso Cuaron & James Cameron');
        });

        it('should not display when less than 3 directors', () => {
          expect(host.debugElement.query(By.css('.director-name'))).toBeFalsy();
        });
      });

      describe('when more than 3 content directors are provided', () => {
        beforeEach(() => {
          host.component.content.directors = ['Alphonso Cuaron', 'James Cameron', 'Martin Scorcese'];
          host.detectChanges();
        });

        it('should not display .directors-name-row', () => {
          expect(host.debugElement.query(By.css('.directors-name-row'))).toBeFalsy();
        });

        it('should display one for each director', () => {
          const elems: DebugElement[] = host.debugElement.queryAll(By.css('.director-name'));
          elems.map((htmlElement: DebugElement, index: number) => {
            expect(htmlElement.nativeElement.textContent).toEqual(host.component.content.directors[index]);
          });
        });
      });
    });

    describe('%OriginCountries: ', () => {
      let oringinCountriesEl: DebugElement[];
      let oringinCountriesErrorEl: DebugElement;

      describe('when origin countries are provided', () => {
        beforeEach(() => {
          host.component.content.originCountries = ['fr', 'ne', 'be'];
          host.detectChanges();
          oringinCountriesEl = host.debugElement.queryAll(By.css('.country-flag'));
          oringinCountriesErrorEl = host.debugElement.query(By.css('.origin-country-error'));
        });

        it('should display one for each production country', () => {
          oringinCountriesEl.map((htmlElement: DebugElement, index: number) => {
            expect((<HTMLElement>htmlElement.nativeElement).getAttribute('src'))
              .toContain(`/${host.component.content.originCountries[index]}/`);
          });
        });

        it('should not display .origin-country-error', () => {
          expect(oringinCountriesErrorEl).toBeFalsy();
        });
      });

      describe('when origin countries are missing', () => {
        it('should display when production country array is empty', () => {
          expect(host.debugElement.query(By.css('.origin-country-error'))).toBeTruthy();
        });
      });
    });

    describe('%ContentImgGroupTop: ', () => {
      it('should not display when backdrops are missing', () => {
        expect(host.debugElement.query(By.css('.content-img-group-top'))).toBeFalsy();
      });

      it('should display when backdrops array is not empty', () => {
        host.component.content.backdrops = ['backdropNo1.png'];
        host.detectChanges();
        expect(host.debugElement.query(By.css('.content-img-group-top'))).toBeTruthy();
      });
    });

    describe('%Synopsis: ', () => {
      it('should contain content overview', () => {
        host.component.content.overview = 'This movie is all about ...';
        host.detectChanges();
        const elem = host.debugElement.query(By.css('.synopsis-tx')).nativeElement;
        expect(elem.textContent).toEqual('This movie is all about ...');
      });
    });

    describe('%Cast: ', () => {
      it('should display one for each cast of the top 10 casts of the content', () => {
        for (let i = 0; i < 15; ++i) {
          host.component.content.cast.push(new Cast());
        }
        host.detectChanges();
        const elems = host.debugElement.queryAll(By.css('.cast'));
        expect(elems.length).toBe(10);
      });
    });

    describe('%CastAvatar: ', () => {
      let cast: Cast;

      beforeEach(() => {
        cast = new Cast();
        host.component.content.cast.push(cast);
      });

      it('should have class broken when cast avatar path contains null', () => {
        cast.person.avatarPath = 'http://api/images/null';
        host.detectChanges();
        const elem = host.debugElement.query(By.css('.cast-avatar')).nativeElement;
        expect(elem.classList).toContain('broken');
      });

      it('should not have class broken', () => {
        host.detectChanges();
        const elem = host.debugElement.query(By.css('.cast-avatar')).nativeElement;
        expect(elem.classList).not.toContain('broken');
      });
    });

    describe('%CastName: ', () => {
      it('should contain the cast name', () => {
        const cast = new Cast();
        cast.person.name = 'Rie Kugimiya';
        host.component.content.cast.push(cast);
        host.detectChanges();
        const elem = host.debugElement.query(By.css('.cast-name')).nativeElement;
        expect(elem.textContent).toEqual('Rie Kugimiya');
      });
    });

    describe('%CastRole: ', () => {
      let castRoleEl: DebugElement;
      let castRoleErrorEl: DebugElement;

      describe('when cast role is provided', () => {
        beforeEach(() => {
          const cast = new Cast();
          cast.character = 'Alphonse Elric';
          host.component.content.cast.push(cast);
          host.detectChanges();
          castRoleEl = host.debugElement.query(By.css('.cast-role'));
          castRoleErrorEl = host.debugElement.query(By.css('.cast-role-error'));
        });

        it('should contain the cast role', () => {
          expect(castRoleEl.nativeElement.textContent).toEqual('In the role of Alphonse Elric');
        });

        it('should not display .cast-role-error', () => {
          expect(castRoleErrorEl).toBeFalsy();
        });
      });

      describe('when cast role is undefined', () => {
        beforeEach(() => {
          host.component.content.cast.push(new Cast());
          host.detectChanges();
          castRoleEl = host.debugElement.query(By.css('.cast-role'));
          castRoleErrorEl = host.debugElement.query(By.css('.cast-role-error'));
        });

        it('should not display .cast-role', () => {
          expect(castRoleEl).toBeFalsy();
        });

        it('should display cast-role-error', () => {
          expect(castRoleErrorEl).toBeTruthy();
        });
      });
    });

    describe('%ContentImgGroupBottom: ', () => {
      it('should not display when less than 3 backdrops are provided', () => {
        host.component.content.backdrops = ['bk1.png', 'bk2.png'];
        expect(host.debugElement.query(By.css('.content-img-group-bottom'))).toBeFalsy();
      });

      it('should display when more than 3 backdrops are provided', () => {
        host.component.content.backdrops = ['bk1.png', 'bk2.png', 'bk3.png'];
        host.detectChanges();
        expect(host.debugElement.query(By.css('.content-img-group-bottom'))).toBeTruthy();
      });
    });
  });
});
