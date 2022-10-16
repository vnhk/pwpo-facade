import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChartsComponent } from './project-charts.component';

describe('ProjectChartsComponent', () => {
  let component: ProjectChartsComponent;
  let fixture: ComponentFixture<ProjectChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
