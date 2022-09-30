import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {DataEnum, Person} from "../../../main/api-models";
import {TaskService} from "../../service/task.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {retry, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  priority: DataEnum[] | undefined;
  taskType: DataEnum[] | undefined;
  addedToProject: Person[] | undefined;
  formGroup: FormGroup;
  MAX_DESC_LENGTH = 1500;
  MAX_SUMMARY_LENGTH = 150;
  id: string | null | undefined;

  constructor(private httpService: HttpService,
              private taskService: TaskService,
              private location: Location,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar) {
    this.formGroup = this.formBuilder.group({
      'type': [null, Validators.required],
      'priority': [null, Validators.required],
      'summary': [null, [Validators.required, Validators.maxLength(150)]],
      'dueDate': [null, [Validators.required]],
      'assignee': [null, []],
      'owner': [null, [Validators.required]],
      'estimation': [null, []],
      'description': [null, [Validators.maxLength(1500)]],
      'project': []
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.httpService.getUsersWithAccessToTheProject(this.id).subscribe(value => this.addedToProject = value.items);
    this.httpService.getEnumByName("com.pwpo.common.enums.Priority").subscribe(value => this.priority = value.items);
    this.httpService.getEnumByName("com.pwpo.task.enums.TaskType").subscribe(value => this.taskType = value.items);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.formGroup.value.project = this.id;
      this.httpService.createTask(this.formGroup.value)
        .pipe(
          retry(3),
          catchError(this.handleError)
        ).subscribe(() => this.showSuccessPopup('Task created!'));
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
      this.showErrorPopup('Task could not be created!');
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      this.showErrorPopup('Task could not be created!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 2500
    });
  }

  private showSuccessPopup(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 2500
    });
  }
}

