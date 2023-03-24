import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Person} from "../../main/api-models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError} from "rxjs/operators";
import {HttpService} from "../../main/service/http.service";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";

@Component({
  selector: 'app-user-manage-option-modal',
  templateUrl: './user-manage-option-modal.component.html',
  styleUrls: ['./user-manage-option-modal.component.css']
})
export class UserManageOptionModalComponent implements OnInit {
  edit = false;
  disabledUser = false;
  formGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Person,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private httpService: HttpService) {

    if (data.roles) {
      this.disabledUser = data.roles?.includes("ROLE_DISABLED");
    }

    this.formGroup = this.formBuilder.group({
      'id': [null, [Validators.required]],
      'firstName': [null, [Validators.required, Validators.maxLength(50)]],
      'lastName': [null, [Validators.required, Validators.maxLength(50)]],
      'email': [null, [Validators.required, Validators.maxLength(50), Validators.email]]
    });
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      id: this.data.id,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      email: this.data.email,
    });
  }

  onSubmitEditUser() {
    if (this.formGroup.valid) {
      this.httpService.editUser(this.formGroup.value)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
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
        this.showErrorPopup('User could not be edited!');
      }
    } else {
      console.log(`Backend returned code ${error.status}, body was: `, error.error);
      this.showErrorPopup('User could not be edited!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation() {
    this.openBarWithMessage('User edited!', ['success-bar'], 15000);
    this.edit = false;
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

  private handleErrorSimple(error: HttpErrorResponse, msg: any) {

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


  disableUser() {
    if (confirm("Are you sure you want to disable this account?")) {
      this.httpService.disableAccount(this.data.id)
        .pipe(
          catchError(err => {
            return this.handleErrorSimple(err, "Cannot disable user!");
          })
        ).subscribe(() => {
        this.openBarWithMessage('User account disabled!', ['success-bar'], 15000);
        this.disabledUser = true;
      });
    }
  }


  enableUser() {
    if (confirm("Are you sure you want to enable this account?")) {
      this.httpService.enableAccount(this.data.id)
        .pipe(
          catchError(err => {
            return this.handleErrorSimple(err, "Cannot enable user account!");
          })
        ).subscribe(() => {
        this.openBarWithMessage('User account enabled!', ['success-bar'], 15000);
        this.disabledUser = false;
      });
    }
  }

  resetPassword() {
    if (confirm("Are you sure you want to reset password for this account?")) {
      this.httpService.resetPassword(this.data.nick)
        .pipe(
          catchError(err => {
            return this.handleErrorSimple(err, "Cannot reset password!");
          })
        ).subscribe((val) => {
        this.openBarWithMessage('Password regenerated: ' + val.password, ['success-bar'], 40000);
        this.disabledUser = false;
      });
    }
  }
}
