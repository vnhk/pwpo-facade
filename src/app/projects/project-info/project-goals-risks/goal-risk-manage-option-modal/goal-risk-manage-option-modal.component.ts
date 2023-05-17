import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {GoalRisk, GoalRiskModal} from "../project-goals-risks.component";
import {HttpService} from "../../../../main/service/http.service";

@Component({
  selector: 'app-goal-risk-manage-option-modal',
  templateUrl: './goal-risk-manage-option-modal.component.html',
  styleUrls: ['./goal-risk-manage-option-modal.component.css']
})
export class GoalRiskManageOptionModalComponent implements OnInit {
  save = false;
  typeDisplay: string;
  formGroup: FormGroup;
  projectId: string | null | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public modalData: GoalRiskModal,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private httpService: HttpService,
              private dialogRef: MatDialogRef<GoalRiskManageOptionModalComponent>) {
    this.typeDisplay = this.modalData.data?.type == "GOAL" ? "goal" : "risk";
    this.projectId = this.modalData.projectId;

    this.save = this.modalData.data?.id == null;

    this.formGroup = this.formBuilder.group({
      'id': [null],
      'content': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      'priority': [null, [Validators.required, Validators.pattern("^[1-5]{1}$")]],
      'type': [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      id: this.modalData.data?.id,
      content: this.modalData.data?.content,
      priority: this.modalData.data?.priority,
      type: this.modalData.data?.type
    });
  }

  onSubmitSave() {
    if (this.formGroup.valid) {
      this.httpService.saveGoalRisk(this.projectId, this.formGroup.value)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successSave());
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

  private successSave() {
    this.openBarWithMessage('Element saved!', ['success-bar'], 15000);
    this.save = false;
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

  deleteGoalRisk() {
    if (confirm("Are you sure you want to delete this " + this.typeDisplay + "?")) {
      this.httpService.deleteGoalRisk(this.projectId, this.modalData.data)
        .pipe(
          catchError(err => {
            return this.handleErrorSimple(err, `The ${this.typeDisplay} cannot be deleted!`);
          })
        ).subscribe(() => {
        this.openBarWithMessage('Delete performed successfully!', ['success-bar'], 15000);
      });
    }
  }

  editGoalRisk() {
    this.save = true;
  }
}
