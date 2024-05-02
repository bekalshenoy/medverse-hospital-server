import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelWrapperComponent } from './model-wrapper.component';

describe('ModelWrapperComponent', () => {
  let component: ModelWrapperComponent;
  let fixture: ComponentFixture<ModelWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
