import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTimelogComponent } from './task-timelog.component';

describe('TaskTimelogComponent', () => {
  let component: TaskTimelogComponent;
  let fixture: ComponentFixture<TaskTimelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskTimelogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTimelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
