import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {retry, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {HttpService} from "../../../../../main/service/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-task-timelog',
  templateUrl: './add-task-timelog.component.html',
  styleUrls: ['./add-task-timelog.component.css']
})
export class AddTaskTimelogComponent implements OnInit {
  formGroup: FormGroup;
  id: string | null | undefined;
  MAX_COMMENT_LENGTH = 500;

  @Output() addedTimelog: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar) {
    this.formGroup = this.createForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.httpService.logTime(this.formGroup.value, this.id)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
  }

  resetForm() {
    this.formGroup.reset();
    this.formGroup = this.createForm();
  }

  parseInt(value: string) {
    return parseInt(value);
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
        this.showErrorPopup('Could not log time, please contact with administrator!');
      }
    } else {
      this.showErrorPopup('Could not log time, please contact with administrator!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation() {
    this.openBarWithMessage('Time has been logged!', ['success-bar'], 15000);
    this.resetForm();
    this.addedTimelog.emit();
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

  private createForm() {
    return this.formBuilder.group({
      'date': [null, [Validators.required]],
      'timeInHours': [0, [Validators.required, Validators.max(20), Validators.min(0)]],
      'timeInMinutes': [0, [Validators.required, Validators.max(60), Validators.min(0)]],
      'comment': [null, [Validators.maxLength(this.MAX_COMMENT_LENGTH)]],
    });
  }
}
