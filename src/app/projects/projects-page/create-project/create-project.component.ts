import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Person} from "../../../main/api-models";
import {MessageBarComponent} from "../../../main/message-bar/message-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  @ViewChild(MessageBarComponent)
  messageBar: MessageBarComponent | undefined;

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
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
  }

  resetForm() {
    this.formGroup.reset();
  }

  private handleError(error: HttpErrorResponse) {
    this.spin = false;

    if (this.messageBar) {
      this.messageBar.requestErrorMessage(error, this.formGroup, 'Project could not be created!');
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private successCreation() {
    this.spin = false;
    if (this.messageBar) {
      this.messageBar.success('Project created!');
    }
    this.resetForm();
  }
}

