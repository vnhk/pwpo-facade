import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../main/session/auth.service";
import {MatAccordion} from "@angular/material/expansion";
import {HttpService} from "../../main/service/http.service";
import {Person} from "../../main/api-models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;
  user: Person | undefined;
  changePasswordForm: FormGroup;
  changePersonalDataForm: FormGroup;
  changeContactForm: FormGroup;
  passwordsDoNotMatch = false;

  constructor(public authService: AuthService, private httpService: HttpService, private formBuilder: FormBuilder,
              public snackBar: MatSnackBar) {
    this.changePasswordForm = this.formBuilder.group({
      'oldPassword': [null, [Validators.minLength(3), Validators.maxLength(50)]],
      'newPassword': [null, [Validators.minLength(3), Validators.maxLength(50)]],
      'newPasswordRepeated': [null, [Validators.minLength(3), Validators.maxLength(50)]],
    });

    this.changePersonalDataForm = this.formBuilder.group({
      'firstName': [null, [Validators.minLength(3), Validators.maxLength(50)]],
      'lastName': [null, [Validators.minLength(3), Validators.maxLength(50)]]
    });

    this.changeContactForm = this.formBuilder.group({
      'email': [null, [Validators.minLength(3), Validators.maxLength(50), Validators.email]]
    });
  }

  ngOnInit(): void {
    this.getLoggedUserDetails();
  }

  private getLoggedUserDetails() {
    this.httpService.getLoggedUserDetails()
      .subscribe(value => this.user = value);
  }

  changePassword() {
    if (this.changePasswordForm.valid) {

      if (this.changePasswordForm.value.newPasswordRepeated !== this.changePasswordForm.value.newPassword) {
        this.passwordsDoNotMatch = true;
        return;
      }
      this.httpService.changePassword(this.changePasswordForm.value)
        .pipe(
          catchError(this.handleChangePasswordError.bind(this))
        ).subscribe(() => {
        this.success("Password changed successfully!");
        this.authService.logout();
      })
    }
  }

  private handleChangePasswordError(error: HttpErrorResponse) {
    if (error.status == 400) {
      this.showErrorPopup(error.error[0].message);
    } else {
      this.showErrorPopup("Could not change password. Contact with administrator.");
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private handleUpdateDataError(error: HttpErrorResponse) {
    if (error.status == 400) {
      this.showErrorPopup(error.error[0].message);
    } else {
      this.showErrorPopup("Could not update data. Contact with administrator.");
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private success(msg: string) {
    this.openBarWithMessage(msg, ['success-bar'], 15000);
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

  changeContactData() {
    if (this.changeContactForm.valid) {
      console.log(this.changeContactForm);
      this.httpService.updateContactData(this.changeContactForm.value)
        .pipe(
          catchError(this.handleUpdateDataError.bind(this))
        ).subscribe(() => {
        this.success("Contacts updated successfully!");
        this.getLoggedUserDetails();
      })
    }
  }

  changePersonalData() {
    if (this.changePersonalDataForm.valid) {
      this.httpService.updatePersonalData(this.changePersonalDataForm.value)
        .pipe(
          catchError(this.handleUpdateDataError.bind(this))
        ).subscribe(() => {
        this.success("Personal data updated successfully!");
        this.getLoggedUserDetails();
      })
    }
  }
}
