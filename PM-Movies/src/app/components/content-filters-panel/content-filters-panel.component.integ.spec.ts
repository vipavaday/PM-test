import { FormsModule } from '@angular/forms';
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
      imports: [
        FormsModule,
      ],
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
  describe('.filters-panel-fluid-container', () => {
    it('should have expanded class when hidden property is false', () => {
      host.component.hidden = false;
      host.detectChanges();
      const filterPanelFluidContainerElem = host.debugElement.query(By.css('.filters-panel-fluid-container')).nativeElement;
      expect(filterPanelFluidContainerElem.classList).toContain('expanded');
    });

    it('should have expanded class when hidden property is true', () => {
      host.component.hidden = true;
      host.detectChanges();
      const filterPanelFluidContainerElem = host.debugElement.query(By.css('.filters-panel-fluid-container')).nativeElement;
      expect(filterPanelFluidContainerElem.classList).not.toContain('expanded');
    });
  });

  describe('.filters-panel-header', () => {
    it('should have expanded class when hidden property is false', () => {
      host.component.hidden = false;
      host.detectChanges();
      const filterPanelHeaderElem = host.debugElement.query(By.css('.filters-panel-header')).nativeElement;
      expect(filterPanelHeaderElem.classList).toContain('expanded');
    });

    it('should not have expanded class when hidden property is true', () => {
      host.component.hidden = true;
      host.detectChanges();
      const filterPanelHeaderElem = host.debugElement.query(By.css('.filters-panel-header')).nativeElement;
      expect(filterPanelHeaderElem.classList).not.toContain('expanded');
    });

    it('should set hidden property to false if it was true on click', () => {
      host.component.hidden = true;
      host.detectChanges();
      const filterPanelHeaderElem = host.debugElement.query(By.css('.filters-panel-header')).nativeElement;
      host.click(filterPanelHeaderElem);
      expect(host.component.hidden).toBe(false);
    });

    it('should set hidden property to true if it was false on click', () => {
      host.component.hidden = false;
      host.detectChanges();
      const filterPanelHeaderElem = host.debugElement.query(By.css('.filters-panel-header')).nativeElement;
      host.click(filterPanelHeaderElem);
      expect(host.component.hidden).toBe(true);
    });
  });

  describe('.filters-panel-header-title', () => {
    it('should have expanded class when hidden property is false', () => {
      host.component.hidden = false;
      host.detectChanges();
      const filterPanelHeaderTitleElem = host.debugElement.query(By.css('.filters-panel-header-title')).nativeElement;
      expect(filterPanelHeaderTitleElem.classList).toContain('expanded');
    });

    it('should not have expanded class when hidden property is true', () => {
      host.component.hidden = true;
      host.detectChanges();
      const filterPanelHeaderTitleElem = host.debugElement.query(By.css('.filters-panel-header-title')).nativeElement;
      expect(filterPanelHeaderTitleElem.classList).not.toContain('expanded');
    });
  });

  describe('.filters-panel-header-icon.close-icon', () => {
    it('should not be displayed when hidden property is true', () => {
      host.component.hidden = true;
      host.detectChanges();
      expect(host.debugElement.query(By.css('.filters-panel-header-icon.close-icon'))).toBeNull();
    });

    it('should be displayed when hidden property is false', () => {
      host.component.hidden = false;
      host.detectChanges();
      expect(host.debugElement.query(By.css('.filters-panel-header-icon.close-icon'))).not.toBeNull();
    });
  });

  describe('.filters-panel', () => {
    it('should not be displayed when hidden property is true', () => {
      host.component.hidden = true;
      host.detectChanges();
      expect(host.debugElement.query(By.css('.filters-panel'))).toBeNull();
    });

    it('should be displayed when hidden property is false', () => {
      host.component.hidden = false;
      host.detectChanges();
      expect(host.debugElement.query(By.css('.filters-panel'))).not.toBeNull();
    });
  });

  describe('.toggle-movie-filter-input', () => {
    beforeEach(() => {
      spyOn(host.component, 'toggleMovieFilter');
    });
    it('should call toggleMovieFilter method on click', () => {
      host.click(host.debugElement.query(By.css('.toggle-movie-filter-input')).nativeElement);
      expect(host.component.toggleMovieFilter).toHaveBeenCalled();
    });
  });

  describe('.toggle-tvshow-filter-input', () => {
    beforeEach(() => {
      spyOn(host.component, 'toggleTvshowFilter');
    });
    it('should call toggleTvshowFilter method on click', () => {
      host.click(host.debugElement.query(By.css('.toggle-tvshow-filter-input')).nativeElement);
      expect(host.component.toggleTvshowFilter).toHaveBeenCalled();
    });
  });

  describe('.gt-release-date', () => {
    beforeEach(() => {
      spyOn(host.component, 'onUpdateFilter');
    });

    it('should call onUpdateFilter on input change', () => {
      host.typeInElement('1459-08-28', '.gt-release-date');
      host.detectChanges();
      expect(host.component.onUpdateFilter).toHaveBeenCalled();
    });
  });

  describe('.lt-release-date', () => {
    beforeEach(() => {
      spyOn(host.component, 'onUpdateFilter');
    });

    it('should call onUpdateFilter on input change', () => {
      host.typeInElement('1459-08-28', '.lt-release-date');
      host.detectChanges();
      expect(host.component.onUpdateFilter).toHaveBeenCalled();
    });
  });
});
