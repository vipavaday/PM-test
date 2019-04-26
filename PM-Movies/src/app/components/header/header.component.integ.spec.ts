import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createHostComponentFactory,
  HostComponentFactory,
  SpectatorWithHost
} from '@pm/spectator';

import { HeaderComponent } from './header.component';

describe('Component: HeaderComponent', () => {
  let createHost: HostComponentFactory<HeaderComponent>;
  let host: SpectatorWithHost<HeaderComponent>;

  beforeEach(() => {
    createHost = createHostComponentFactory({
      component: HeaderComponent,
      shallow: true,
      imports: [
        RouterTestingModule
      ],
    });
  });

  it('should render', () => {
    host = createHost('<app-header></app-header>');
    expect(host.getDirectiveInstance('app-header')).toBeTruthy();
  });

  it('should have a link to the homepage on logo', () => {
    const elem: HTMLElement = host.debugElement.query(By.css('.logo-wrapper')).nativeElement;
    expect(elem.getAttribute('href')).toEqual('/');
  });

  it('should have a link to the homepage on title', () => {
    const elem: HTMLElement = host.debugElement.query(By.css('.header-title-link')).nativeElement;
    expect(elem.getAttribute('href')).toEqual('/');
  });

  it('should have a title', () => {
    const elem: HTMLElement = host.debugElement.query(By.css('.header-title-link')).nativeElement;
    expect(elem.textContent).toEqual('The Perfect Movie');
  });

  it('should have an app-search-bar child component', () => {
    const elem: HTMLElement = host.debugElement.query(By.css('.header-title-link')).nativeElement;
    expect(host.getDirectiveInstance('app-search-bar')).toBeTruthy();
  });
});
