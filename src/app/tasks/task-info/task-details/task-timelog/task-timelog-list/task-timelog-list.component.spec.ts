import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTimelogListComponent } from './task-timelog-list.component';

describe('TaskTimelogListComponent', () => {
  let component: TaskTimelogListComponent;
  let fixture: ComponentFixture<TaskTimelogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskTimelogListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTimelogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
