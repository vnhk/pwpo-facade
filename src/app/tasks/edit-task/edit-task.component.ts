import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from '@angular/common';
import {DataEnum, Person, Task} from "../../main/api-models";
import {HttpService} from "../../main/service/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {QuillEditorComponent} from "ngx-quill";

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  formGroup: FormGroup;
  priority: DataEnum[] = [];
  taskType: DataEnum[] = [];
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

  @ViewChild(QuillEditorComponent)
  editorComponent: QuillEditorComponent | undefined;

  constructor(private httpService: HttpService,
              private location: Location,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private router: Router) {
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

  goToTaskDetails() {
    this.formGroup.reset();
    this.router.navigateByUrl("/tasks/" + this.taskId + "/details");
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
      this.formGroup.value.description = this.editorComponent?.valueGetter(this.editorComponent.quillEditor, this.editorComponent.editorElem);
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
    this.goToTaskDetails();
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
    this.defaultType = this.taskType.filter(s => s.displayName == this.taskPrimary.type)[0];
    this.defaultPriority = this.priority.filter(s => s.displayName == this.taskPrimary.priority)[0];

    this.httpService.getUsersWithAccessToTheProject("" + (task.project?.id), "nick", "asc", 1, 5000).subscribe(
      value => {
        this.addedToProject = value.items;
        this.buildDefaultPrimaryValues();
      }
    );
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
    let x = this.taskSecondary.estimation;
    let hours = 0;
    let minutes = 0;
    if (x != undefined) {
      minutes = x % 60;
      hours = (x - minutes) / 60;
    }

    if (this.taskSecondary.description && this.editorComponent) {
      this.editorComponent.content = this.taskSecondary.description;
    }

    this.formGroup.patchValue({
      description: this.taskSecondary.description,
      estimationInHours: hours,
      estimationInMinutes: minutes,
    });
  }

  parseInt(value: string): number {
    return Number.parseInt(value);
  }
}

