import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskTimelogComponent } from './add-task-timelog.component';

describe('AddTaskTimelogComponent', () => {
  let component: AddTaskTimelogComponent;
  let fixture: ComponentFixture<AddTaskTimelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTaskTimelogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskTimelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
