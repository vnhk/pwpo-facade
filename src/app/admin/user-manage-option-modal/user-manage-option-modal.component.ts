import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Person} from "../../main/api-models";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
  editData = false;
  disabledUser = false;
  editDataFormGroup: FormGroup;
  editRolesFormGroup: FormGroup;
  rolesList = ["ROLE_ADMIN", "ROLE_USER", "ROLE_MANAGER", "ROLE_DISABLED", "ROLE_NOT_ACTIVATED"];
  editRoles = false;

  roles = new FormControl([]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Person,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private httpService: HttpService) {

    console.log(data);
    if (data.roles) {
      this.disabledUser = data.roles?.includes("ROLE_DISABLED");
      // @ts-ignore
      this.roles = new FormControl(data.roles);
    }

    this.editDataFormGroup = this.formBuilder.group({
      'id': [null, [Validators.required]],
      'firstName': [null, [Validators.required, Validators.maxLength(50)]],
      'lastName': [null, [Validators.required, Validators.maxLength(50)]],
      'email': [null, [Validators.required, Validators.maxLength(50), Validators.email]]
    });

    this.editRolesFormGroup = this.formBuilder.group({
      'id': [null, [Validators.required]],
      'roles': [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.editDataFormGroup.patchValue({
      id: this.data.id,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      email: this.data.email,
    });

    this.editRolesFormGroup = this.formBuilder.group({
      'id': [null, [Validators.required]],
      'roles': this.roles
    });
  }

  onSubmitEditUser() {
    if (this.editDataFormGroup.valid) {
      this.httpService.editUser(this.editDataFormGroup.value)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
  }

  onSubmitManageRoles() {
    if (this.editRolesFormGroup.valid) {
      this.httpService.editRoles(this.editRolesFormGroup.value)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      if (error.error[0].code === "FIELD_VALIDATION") {
        let formInput = this.editDataFormGroup.get(error.error[0].field);
        formInput?.setErrors({'incorrect': true});

        this.showErrorPopup((error.error[0].message));

      } else if (error.error[0].code === "GENERAL_VALIDATION") {
        this.showErrorPopup((error.error[0].message));
      } else {
        this.showErrorPopup('User could not be edited!');
      }
    } else {
      this.showErrorPopup('User could not be edited!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation() {
    this.openBarWithMessage('User edited!', ['success-bar'], 15000);
    this.editData = false;
    this.editRoles = false;
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
}
