import {Component, OnInit} from '@angular/core';
import {Person} from "../../main/api-models";
import {HttpService} from "../../main/service/http.service";
import {UserManageOptionModalComponent} from "../user-manage-option-modal/user-manage-option-modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  roles = ["ROLE_ADMIN", "ROLE_USER", "ROLE_MANAGER"];
  displayedColumns = ["nick", "email", "roles"];
  notActivatedUsers: Person[] = [];
  allUsers: Person[] = [];
  formGroup: FormGroup;

  constructor(private http: HttpService, public dialog: MatDialog, private formBuilder: FormBuilder, public snackBar: MatSnackBar) {
    this.formGroup = this.formBuilder.group({
      'username': [null, [Validators.required, Validators.min(3), Validators.max(50)]],
      'email': [null, [Validators.required, Validators.min(3), Validators.max(50), Validators.email]],
      'firstName': [null, [Validators.required, Validators.min(3), Validators.max(50)]],
      'lastName': [null, [Validators.required, Validators.min(3), Validators.max(50)]],
      'role': [null, [Validators.required]]
    });
  }

  resetCreateUserForm() {
    this.formGroup.patchValue({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      role: ""
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  openActionModal(row: Person) {
    let matDialogRef = this.dialog.open(UserManageOptionModalComponent,
      {
        data: row
      });

    matDialogRef.afterClosed().subscribe(value => {
      this.getUsers();
    });
  }

  createUser() {
    if (this.formGroup.valid) {
      this.http.createUser(this.formGroup.value)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe((value) => this.successCreation(value));
    }
  }

  private getUsers() {
    this.http.getAllUsersWithRoles().subscribe(value => {
      this.allUsers = value.items;

      this.notActivatedUsers = this.allUsers.filter(v => v.roles?.includes("ROLE_NOT_ACTIVATED"))
    })
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.showErrorPopup('User could not be created!');
    } else if (error.status == 400) {
      if (error.error[0].code === "FIELD_VALIDATION") {
        let formInput = this.formGroup.get(error.error[0].field);
        formInput?.setErrors({'incorrect': true});
        this.showErrorPopup((error.error[0].message));
      } else if (error.error[0].code === "GENERAL_VALIDATION") {
        this.showErrorPopup((error.error[0].message));
      } else {
        this.showErrorPopup('Could not log time, please contact with administrator!');
      }
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation(value: any) {
    this.openBarWithMessage(`User created! Password: ` + value.password, ['success-bar'], 15000);
    this.resetCreateUserForm();
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }
}
