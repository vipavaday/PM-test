import {
  createHostComponentFactory,
  HostComponentFactory,
  SpectatorWithHost
} from '@pm/spectator';

import { AppComponent } from './app.component';

describe('Component: App', () => {
  let createHost: HostComponentFactory<AppComponent>;
  let host: SpectatorWithHost<AppComponent>;

  beforeEach(() => {
    createHost = createHostComponentFactory({
      component: AppComponent,
      shallow: true
    });
  });

  it('should render', () => {
    host = createHost('<app></app>');
    expect(host.getDirectiveInstance('app')).toBeTruthy();
  });
});
