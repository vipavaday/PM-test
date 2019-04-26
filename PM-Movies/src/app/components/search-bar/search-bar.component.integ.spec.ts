import {
  createHostComponentFactory,
  HostComponentFactory,
  SpectatorWithHost
} from '@pm/spectator';

import {
  ContentListStateService,
  ContentListStateServiceMock
} from '../../services';
import { SearchBarComponent } from './search-bar.component';

describe('Component: SearchBarComponent', () => {
  let createHost: HostComponentFactory<SearchBarComponent>;
  let host: SpectatorWithHost<SearchBarComponent>;

  beforeEach(() => {
    createHost = createHostComponentFactory({
      component: SearchBarComponent,
      shallow: true,
      providers: [
        { provide: ContentListStateService, useClass: ContentListStateServiceMock }
      ]
    });
    host = createHost('<app-search-bar></app-search-bar>');
  });

  it('should render', () => {
    expect(host.getDirectiveInstance('app-search-bar')).toBeTruthy();
  });

  it('should call onSearchUpdate on input', () => {
    spyOn(host.component, 'onSearchUpdate');
    host.typeInElement('sense8', '.search-bar-input');
    expect(host.component.onSearchUpdate).toHaveBeenCalledWith('sense8');
  });
});
