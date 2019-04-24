import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  createHostComponentFactory,
  HostComponentFactory,
  SpectatorWithHost,
} from '@pm/spectator';

import {
  FilterManagerService,
  FilterManagerServiceMock
} from '../../services';
import { ContentFiltersPanelComponent } from './content-filters-panel.component';

describe('Component: ContentFiltersPanelComponent', () => {
  let createHost: HostComponentFactory<ContentFiltersPanelComponent>;
  let host: SpectatorWithHost<ContentFiltersPanelComponent>;

  beforeEach(() => {
    createHost = createHostComponentFactory({
      component: ContentFiltersPanelComponent,
      shallow: true,
      providers: [
        { provide: FilterManagerService, useClass: FilterManagerServiceMock }
      ]
    });
    host = createHost(
      '<app-content-filters-panel></app-content-filters-panel>',
      true
    );
  });

  it('should render', () => {
    expect(host.getDirectiveInstance('app-content-filters-panel')).toBeTruthy();
  });

  it('should display expanded filter panel when hidden property is false', () => {
    host.component.hidden = false;
    host.detectChanges();
    const filterPanelFluidContainerElem = host.debugElement.query(By.css('.filters-panel-fluid-container')).nativeElement;
    expect(filterPanelFluidContainerElem.classList).toContain('expanded');
  });

  it('should not display expanded filter panel when hidden property is true', () => {
    host.component.hidden = true;
    host.detectChanges();
    const filterPanelFluidContainerElem = host.debugElement.query(By.css('.filters-panel-fluid-container')).nativeElement;
    expect(filterPanelFluidContainerElem.classList).not.toContain('expanded');
  });
});
