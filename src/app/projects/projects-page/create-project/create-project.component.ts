import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {retry, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Person} from "../../../main/api-models";

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  formGroup: FormGroup;
  users: Person[] | undefined;
  MAX_DESC_LENGTH = 1500;
  MAX_SUMMARY_LENGTH = 150;
  NAME_MAX_LENGTH = 35;
  SHORT_FORM_MAX_LENGTH = 6;
  spin: boolean = false;

  constructor(private httpService: HttpService,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar) {
    this.formGroup = this.formBuilder.group({
      'summary': [null, [Validators.required, Validators.maxLength(this.MAX_SUMMARY_LENGTH)]],
      'name': [null, [Validators.required, Validators.maxLength(this.NAME_MAX_LENGTH)]],
      'shortForm': [null, [Validators.required, Validators.maxLength(this.SHORT_FORM_MAX_LENGTH)]],
      'owner': [null, [Validators.required]],
      'description': [null, [Validators.maxLength(this.MAX_DESC_LENGTH)]],
    });
  }

  ngOnInit(): void {
    this.spin = true;
    this.httpService.getAllUsers().subscribe(value => {
      this.users = value.items;
      this.spin = false;
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.spin = true;
      this.httpService.createProject(this.formGroup.value)
        .pipe(
          retry(3),
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
  }

  resetForm() {
    this.formGroup.reset();
  }

  private handleError(error: HttpErrorResponse) {
    this.spin = false;

    if (error.status === 400) {
      if (error.error.code === "FIELD_VALIDATION") {
        let formInput = this.formGroup.get(error.error.field);
        formInput?.setErrors({'incorrect': true});

        this.showErrorPopup((error.error.message));

      } else if (error.error.code === "GENERAL_VALIDATION") {
        this.showErrorPopup((error.error.message));
      } else {
        this.showErrorPopup('Project could not be created!');
      }
    } else {
      console.log(`Backend returned code ${error.status}, body was: `, error.error);
      this.showErrorPopup('Project could not be created!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation() {
    this.spin = false;
    this.openBarWithMessage('Project created!', ['success-bar'], 15000);
    this.resetForm();
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }
}

