import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraVisualComponent } from './camera-visual.component';

describe('CameraVisualComponent', () => {
  let component: CameraVisualComponent;
  let fixture: ComponentFixture<CameraVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraVisualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
