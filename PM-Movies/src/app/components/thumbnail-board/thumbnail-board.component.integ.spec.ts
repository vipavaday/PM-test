import { By } from '@angular/platform-browser';

import {
  createHostComponentFactory,
  HostComponentFactory,
  SpectatorWithHost
} from '@pm/spectator';

import {
  ContentFetcherService,
  ContentFetcherServiceMock,
  ContentListStateService,
  ContentListStateServiceMock,
  FilterManagerService,
  FilterManagerServiceMock
} from 'src/app/services';

import { Content } from 'src/app/models';
import { ThumbnailBoardComponent } from './thumbnail-board.component';

describe('Component: ThumbnailBoardComponent', () => {
  let createHost: HostComponentFactory<ThumbnailBoardComponent>;
  let host: SpectatorWithHost<ThumbnailBoardComponent>;

  beforeEach(() => {
    createHost = createHostComponentFactory({
      component: ThumbnailBoardComponent,
      shallow: true,
      providers: [
        { provide: ContentFetcherService, useClass: ContentFetcherServiceMock },
        { provide: ContentListStateService, useClass: ContentListStateServiceMock },
        { provide: FilterManagerService, useClass: FilterManagerServiceMock }
      ]
    });
    host = createHost('<app-thumbnail-board></app-thumbnail-board>');
  });

  it('should render', () => {
    expect(host.getDirectiveInstance('app-thumbnail-board')).toBeTruthy();
  });

  it('should have a content filters panel child component', () => {
    expect(host.getDirectiveInstance('app-content-filters-panel')).toBeTruthy();
  });

  describe('%Thumnails: ', () => {
    describe('when content list is empty', () => {
      it('should have empty class on .thumbnail-board-thumbnails', () => {
        const elem = host.debugElement.query(By.css('.thumbnail-board-thumbnails')).nativeElement;
        expect(elem.classList).toContain('empty');
      });

      it('should display .thumbnail-board-empty-msg', () => {
        const elem = host.debugElement.query(By.css('.thumbnail-board-empty-msg'));
        expect(elem).toBeTruthy();
      });
    });

    describe('when content list is not empty', () => {
      beforeEach(() => {
        const hiddenContent = new Content('h');
        hiddenContent.visible = false;
        host.component.contents = [new Content('a'), new Content('b'), hiddenContent];
        host.detectChanges();
      });

      it('should not have empty class on .thumbnail-board-thumbnails', () => {
        const elem = host.debugElement.query(By.css('.thumbnail-board-thumbnails')).nativeElement;
        expect(elem.classList).not.toContain('empty');
      });

      it('should contain as many app-content-thumbnail child components as there are visible contents', () => {
        const elems = host.debugElement.queryAll(By.css('app-content-thumbnail'));
        expect(elems.length).toBe(2);
      });

      it('should not display .thumbnail-board-empty-msg', () => {
        const elem = host.debugElement.query(By.css('.thumbnail-board-empty-msg'));
        expect(elem).toBeFalsy();
      });
    });
  });
});
