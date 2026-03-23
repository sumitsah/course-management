import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastBarComponent } from './toast-bar.component';

describe('ToastBarComponent', () => {
  let component: ToastBarComponent;
  let fixture: ComponentFixture<ToastBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
