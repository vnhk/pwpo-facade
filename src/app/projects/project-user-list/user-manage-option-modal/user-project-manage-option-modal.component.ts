import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {HttpService} from "../../../main/service/http.service";
import {PersonModal} from "../project-user-list.component";
import {DataEnum, Person} from "../../../main/api-models";

@Component({
  selector: 'user-manage-risk-manage-option-modal',
  templateUrl: './user-project-manage-option-modal.component.html',
  styleUrls: ['./user-project-manage-option-modal.component.css']
})
export class UserProjectManageOptionModalComponent implements OnInit {
  create = false;
  edit = false;
  formGroup: FormGroup;
  projectId: string | null | undefined;
  notAddedUsers: Person[] | undefined;
  roles: DataEnum[] | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public modalData: PersonModal,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private httpService: HttpService,
              private dialogRef: MatDialogRef<UserProjectManageOptionModalComponent>) {
    this.projectId = this.modalData.projectId;

    this.formGroup = this.formBuilder.group({
      'user': [null, [Validators.required]],
      'projectRole': [null, [Validators.required]],
    });

    if(this.modalData.data?.id == null) {
      this.createUser();
    } else {
      this.editUser();
    }
  }

  ngOnInit(): void {
    this.getUsersNotAdded();
    this.httpService.getEnumByName("com.pwpo.user.ProjectRole").subscribe(value => this.roles = value.items);
  }

  getUsersNotAdded() {
    this.httpService.getUsersNotAddedToTheProject(this.projectId).subscribe(value => this.notAddedUsers = value.items);
  }

  onSubmitSave() {
    if (this.formGroup.valid) {
      this.httpService.addUserToProject(this.formGroup.value, this.projectId)
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
        this.showErrorPopup('Save failed!');
      }
    } else {
      console.log(`Backend returned code ${error.status}, body was: `, error.error);
      this.showErrorPopup('Save failed!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation() {
    this.openBarWithMessage('User has been successfully added!', ['success-bar'], 15000);
    this.dialogRef.close();
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

  delete() {
    if (confirm("Are you sure you want to remove this user ?")) {
      this.httpService.removeUserFromProject(this.projectId, this.modalData.data?.id)
        .pipe(
          catchError(err => {
            return this.handleErrorSimple(err, `The user cannot be removed!`);
          })
        ).subscribe(() => {
        this.openBarWithMessage('User removed!', ['success-bar'], 15000);
        this.dialogRef.close();
      });
    }
  }

  editUser() {
    this.create = false;
    this.edit = true;

    console.log(this.modalData.data?.projectRole);

    this.formGroup.patchValue({
      user: this.modalData.data?.id,
      projectRole: null
    });
  }

  createUser() {
    this.edit = false;
    this.create = true;
  }
}
