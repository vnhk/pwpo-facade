import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {retry, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from '@angular/common';
import {DataEnum, Person} from "../../main/api-models";

@Component({
  selector: 'app-add-user-project',
  templateUrl: './add-user-project.component.html',
  styleUrls: ['./add-user-project.component.css']
})
export class AddUserProjectComponent implements OnInit {
  formGroup: FormGroup;
  notAddedUsers: Person[] | undefined;
  id: string | null | undefined;
  roles: DataEnum[] | undefined;

  constructor(private httpService: HttpService,
              private location: Location,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar) {
    this.formGroup = this.formBuilder.group({
      'user': [null, [Validators.required]],
      'projectRole': [null, [Validators.required]],
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.getUsersNotAdded();
    this.httpService.getEnumByName("com.pwpo.user.ProjectRole").subscribe(value => this.roles = value.items);
  }

  getUsersNotAdded() {
    this.httpService.getUsersNotAddedToTheProject(this.id).subscribe(value => this.notAddedUsers = value.items);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.httpService.addUserToProject(this.formGroup.value, this.id)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
  }

  resetForm() {
    this.formGroup.reset();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      if (error.error.code === "GENERAL_VALIDATION") {
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
    this.openBarWithMessage('User has been successfully added!', ['success-bar'], 15000);
    this.resetForm();
    this.getUsersNotAdded();
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }
}

