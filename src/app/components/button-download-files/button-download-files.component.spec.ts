import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDownloadFilesComponent } from './button-download-files.component';

describe('ButtonDownloadFilesComponent', () => {
  let component: ButtonDownloadFilesComponent;
  let fixture: ComponentFixture<ButtonDownloadFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonDownloadFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonDownloadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
