import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFiltersPanelComponent } from './content-filters-panel.component';

describe('ContentFiltersPanelComponent', () => {
  let component: ContentFiltersPanelComponent;
  let fixture: ComponentFixture<ContentFiltersPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFiltersPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
