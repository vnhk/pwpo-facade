import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {retry, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from '@angular/common';
import {DataEnum, Person, Task} from "../../main/api-models";
import {HttpService} from "../../main/service/http.service";

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  formGroup: FormGroup;
  priority: DataEnum[] | undefined;
  taskType: DataEnum[] | undefined;
  addedToProject: Person[] | undefined;
  status: DataEnum[] = [];
  defaultStatus: DataEnum | undefined;
  defaultType: DataEnum | undefined;
  defaultPriority: DataEnum | undefined;
  MAX_DESC_LENGTH = 1500;
  MAX_SUMMARY_LENGTH = 150;
  NAME_MAX_LENGTH = 35;
  SHORT_FORM_MAX_LENGTH = 6;
  private taskPrimary: Task = {};
  private taskSecondary: Task = {};
  private taskId: string | null | undefined;

  constructor(private httpService: HttpService,
              private location: Location,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar) {
    this.formGroup = this.formBuilder.group({
      'id': [null, [Validators.required]],
      'type': [null, Validators.required],
      'priority': [null, Validators.required],
      'summary': [null, [Validators.required, Validators.maxLength(150)]],
      'dueDate': [null, [Validators.required]],
      'assignee': [null, []],
      'owner': [null, [Validators.required]],
      'status': [null, [Validators.required]],
      'estimationInHours': [0, [Validators.min(0), Validators.max(3600)]],
      'estimationInMinutes': [0, [Validators.min(0), Validators.max(60)]],
      'description': [null, [Validators.maxLength(1500)]],
    });
  }

  goBack() {
    this.formGroup.reset();
    this.location.back();
  }

  async ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get("id");

    this.httpService.getEnumByName("com.pwpo.common.enums.Priority").subscribe(value => this.priority = value.items);
    this.httpService.getEnumByName("com.pwpo.task.enums.TaskType").subscribe(value => this.taskType = value.items);

    await this.httpService.getEnumByName("com.pwpo.common.enums.Status").subscribe((value) => this.status = value.items);

    this.httpService.getTaskPrimaryById(this.taskId).subscribe(value => this.setPrimary(value.items[0]));
    this.httpService.getTaskSecondaryById(this.taskId).subscribe(value => this.setSecondary(value.items[0]));
  }

  onSubmit() {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      this.httpService.editTask(this.formGroup.value)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
  }

  resetForm() {
    this.formGroup.reset();
    this.buildDefaultPrimaryValues();
    this.buildDefaultSecondaryValues();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      if (error.error.code === "FIELD_VALIDATION") {
        let formInput = this.formGroup.get(error.error.field);
        formInput?.setErrors({'incorrect': true});

        this.showErrorPopup((error.error.message));

      } else if (error.error.code === "GENERAL_VALIDATION") {
        this.showErrorPopup((error.error.message));
      } else {
        this.showErrorPopup('Task could not be edited!');
      }
    } else {
      console.log(`Backend returned code ${error.status}, body was: `, error.error);
      this.showErrorPopup('Task could not be edited!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation() {
    this.openBarWithMessage('Task edited!', ['success-bar'], 15000);
    this.resetForm();
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

  private setPrimary(task: Task) {
    this.taskPrimary = task;
    this.defaultStatus = this.status.filter(s => s.displayName == this.taskPrimary.status)[0];
    this.defaultType = this.status.filter(s => s.displayName == this.taskPrimary.type)[0];
    this.defaultPriority = this.status.filter(s => s.displayName == this.taskPrimary.priority)[0];
    this.buildDefaultPrimaryValues();
  }

  private setSecondary(task: Task) {
    this.taskSecondary = task;
    this.buildDefaultSecondaryValues();
  }

  private buildDefaultPrimaryValues() {
    this.formGroup.patchValue({
      id: this.taskId,
      summary: this.taskPrimary.summary,
      number: this.taskPrimary.number,
      dueDate: this.taskPrimary.dueDate,
      assignee: this.taskPrimary.assignee?.id,
      status: this.defaultStatus?.internalName,
      priority: this.defaultPriority?.internalName,
      type: this.defaultType?.internalName,
      owner: this.taskPrimary.owner?.id,
    });
  }

  private buildDefaultSecondaryValues() {
    this.formGroup.patchValue({
      description: this.taskSecondary.description,
      estimation: this.taskSecondary.estimation
    });
  }

  parseInt(value: string): number {
    return Number.parseInt(value);
  }
}

