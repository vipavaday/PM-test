import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';
import {
  createHostComponentFactory,
  HostComponentFactory,
  SpectatorWithHost,
} from '@pm/spectator';

import {
  StorageServiceMock,
  StorageService
} from 'src/app/services';
import { Content } from '../../models';
import { ContentThumbnailComponent } from '../../components';

describe('Component: ContentThumbnailComponent', () => {
  let createHost: HostComponentFactory<ContentThumbnailComponent>;
  let host: SpectatorWithHost<ContentThumbnailComponent>;

  beforeEach(() => {
    createHost = createHostComponentFactory({
      component: ContentThumbnailComponent,
      shallow: true,
      providers: [
        { provide: StorageService, useClass: StorageServiceMock }
      ],
      imports: [
        RouterTestingModule,
      ],
    });
  });

  it('should render', () => {
    host = createHost('<app-content-thumbnail></app-content-thumbnail>');
    expect(host.getDirectiveInstance('app-content-thumbnail')).toBeTruthy();
  });

  describe('Input: Content', () => {
    let hostElement: DebugElement;

    beforeEach(() => {
      const content = new Content('Test content', 120, new Date('12/12/2012'), 7836);
      content.type = 'movie';
      host = createHost(
        '<app-content-thumbnail [content]="content"></app-content-thumbnail>',
        true,
        {
          content: content,
        });
      hostElement = host.debugElement;
    });

    it('should add placeholder for poster when missing', () => {
      const cardImgTopElem: HTMLElement = hostElement.query(By.css('.card-img-top')).nativeElement;
      host.component.content.posterUrl = undefined;
      expect(cardImgTopElem.classList.contains('empty')).toBe(true);
    });

    it('should not add placeholder for poster when present', () => {
      host.component.content.posterUrl = '/myPoster.jpg';
      host.detectChanges();
      const cardImgTopElem: HTMLElement = hostElement.query(By.css('.card-img-top')).nativeElement;
      expect(cardImgTopElem.classList.contains('empty')).toBe(false);
    });

    it('should display content poster', () => {
      host.component.content.posterUrl = '/myPoster.jpg';
      host.detectChanges();
      const contentPosterElem: HTMLElement = hostElement.query(By.css('.content-poster')).nativeElement;
      expect(contentPosterElem.getAttribute('src')).toEqual('/myPoster.jpg');
    });

    it('should be a routerLink to the content detail page', () => {
      const cardBodyElem = hostElement.query(By.css('.card-body'));
      expect(cardBodyElem.properties['href']).toEqual('/detail/movie/7836');
    });

    it('should display content overview 250 first characters and append it suspension points', () => {
      host.component.content.overview = `overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview `;
      host.detectChanges();
      const cardTextElem: HTMLElement = hostElement.query(By.css('.card-text')).nativeElement;
      expect(cardTextElem.textContent).toEqual(host.component.content.overview.slice(0, 250) + '...');
    });

    it('should display full content overview on hover', () => {
      host.component.content.overview = `overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview
      overview overview overview overview overview overview overview of the content`;
      host.detectChanges();
      const cardTextElem: HTMLElement = hostElement.query(By.css('.card-text')).nativeElement;
      expect(cardTextElem.getAttribute('title')).toEqual(host.component.content.overview);
    });

    it('should add content to watchlist when user clicks on watch button', () => {
      const toggleWatchElem = hostElement.query(By.css('.btn.to-watch')).nativeElement;
      spyOn(host.component, 'toggleWatchList');
      host.click(toggleWatchElem);
      expect(host.component.toggleWatchList).toHaveBeenCalled();
    });

    it('should mark content as watched when user clicks on watched button', () => {
      const toggleWatchedElem = hostElement.query(By.css('.btn.watched')).nativeElement;
      spyOn(host.component, 'toggleWatchedContent');
      host.click(toggleWatchedElem);
      expect(host.component.toggleWatchedContent).toHaveBeenCalled();
    });

    it('should display to-watch button with plain color background when content is to be watched', () => {
      host.component.content.toWatch = true;
      host.detectChanges();
      const toggleWatchedElem = hostElement.query(By.css('.btn.to-watch')).nativeElement;
      expect(toggleWatchedElem.classList).toContain('btn-primary');
    });

    it('should display watched button with plain color background when content is to be watched', () => {
      host.component.content.watched = true;
      host.detectChanges();
      const toggleWatchedElem = hostElement.query(By.css('.btn.watched')).nativeElement;
      expect(toggleWatchedElem.classList).toContain('btn-primary');
    });

    it('should display to-watch button with outlined color background when content is not to be watched', () => {
      host.component.content.toWatch = false;
      host.detectChanges();
      const toggleWatchedElem = hostElement.query(By.css('.btn.to-watch')).nativeElement;
      expect(toggleWatchedElem.classList).toContain('btn-outline-primary');
    });

    it('should display watched button with outlined color background when content is not to be watched', () => {
      host.component.content.watched = false;
      host.detectChanges();
      const toggleWatchedElem = hostElement.query(By.css('.btn.watched')).nativeElement;
      expect(toggleWatchedElem.classList).toContain('btn-outline-primary');
    });

    it('should display content title', () => {
      const cardTitleElem = hostElement.query(By.css('.card-title')).nativeElement;
      expect(cardTitleElem.textContent).toEqual('Test content');
    });

    it('should not display date block if release date is missing', () => {
      host.component.content.releaseDate = undefined;
      host.detectChanges();
      expect(hostElement.query(By.css('.content-release-date'))).toBeNull();
    });

    it('should display content release date', () => {
      const releaseDateValElem = hostElement.query(By.css('.content-release-date-val')).nativeElement;
      expect(releaseDateValElem.textContent).toBe('12 December 2012');
    });
  });

  describe('Input: undefined', () => {
    beforeEach(() => {
      host = createHost(
        '<app-content-thumbnail [content]="content"></app-content-thumbnail>',
        true,
        {
          content: undefined,
        });
    });

    it('should not render component content', () => {
      expect(host.debugElement.query(By.css('.content-thumbnail'))).toBeNull();
    });
  });
});
