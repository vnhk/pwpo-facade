import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.css']
})
export class MessageBarComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  public error(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  public success(message: string) {
    this.openBarWithMessage(message, ['success-bar'], 15000);
  }

  public requestErrorMessage(error: HttpErrorResponse, formGroup: FormGroup, generalMessage: string) {
    let message = "";
    if (error.status === 400) {
      for (let i = 0; i < error.error.length; i++) {
        if (error.error[i].code === "FIELD_VALIDATION") {
          let formInput = formGroup.get(error.error[i].field);
          formInput?.setErrors({'incorrect': true});
          message += error.error[i].message + "\n";
        } else if (error.error[i].code === "GENERAL_VALIDATION") {
          message += error.error[i].message + "\n";
        }
      }
    }

    if (message == "") {
      message = generalMessage;
    }

    this.error(message);
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

}
