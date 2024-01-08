import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from '@angular/common';
import {DataEnum, Person, Project} from "../../main/api-models";
import {HttpService} from "../../main/service/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {QuillEditorComponent} from "ngx-quill";

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  formGroup: FormGroup;
  users: Person[] | undefined;
  status: DataEnum[] = [];
  defaultStatus: DataEnum | undefined;
  MAX_DESC_LENGTH = 1500;
  MAX_SUMMARY_LENGTH = 150;
  NAME_MAX_LENGTH = 35;
  SHORT_FORM_MAX_LENGTH = 6;
  private projectPrimary: Project = {};
  private projectSecondary: Project = {};

  @ViewChild(QuillEditorComponent)
  editorComponent: QuillEditorComponent = new QuillEditorComponent();

  constructor(private httpService: HttpService,
              private location: Location,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar) {
    this.formGroup = this.formBuilder.group({
      'id': [null, [Validators.required]],
      'summary': [null, [Validators.required, Validators.maxLength(this.MAX_SUMMARY_LENGTH)]],
      'name': [null, [Validators.required, Validators.maxLength(this.NAME_MAX_LENGTH)]],
      'shortForm': [null, [Validators.required, Validators.maxLength(this.SHORT_FORM_MAX_LENGTH)]],
      'owner': [null, [Validators.required]],
      'status': [null, [Validators.required]],
      'description': [null, [Validators.maxLength(this.MAX_DESC_LENGTH)]],
    });
  }

  goBack() {
    this.formGroup.reset();
    this.location.back();
  }

  async ngOnInit() {
    let projectId = this.route.snapshot.paramMap.get("id");

    await this.httpService.getAllUsers().subscribe(value => this.users = value.items);
    await this.httpService.getEnumByName("com.pwpo.common.enums.Status").subscribe((value) => this.status = value.items);

    this.httpService.getProjectByIdPrimaryAttr(projectId).subscribe(value => this.setPrimary(value.items[0]));
    this.httpService.getProjectByIdSecondaryAttr(projectId).subscribe(value => this.setSecondary(value.items[0]));
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.formGroup.value.description = this.editorComponent.valueGetter(this.editorComponent.quillEditor, this.editorComponent.editorElem);
      this.httpService.editProject(this.formGroup.value)
        .pipe(
          catchError(this.handleError.bind(this))
        ).subscribe(() => this.successCreation());
    }
  }

  resetForm() {
    this.formGroup.reset();
    this.buildDefaultPrimaryValues();
    this.buildDefaultSecondaryValues();
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
        this.showErrorPopup('Project could not be edited!');
      }
    } else {
      console.log(`Backend returned code ${error.status}, body was: `, error.error);
      this.showErrorPopup('Project could not be edited!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation() {
    this.openBarWithMessage('Project edited!', ['success-bar'], 15000);
    this.resetForm();
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

  private setPrimary(project: Project) {
    this.projectPrimary = project;
    this.defaultStatus = this.status.filter(s => s.displayName == this.projectPrimary.status)[0];
    this.buildDefaultPrimaryValues();
  }

  private setSecondary(project: Project) {
    this.projectSecondary = project;
    this.buildDefaultSecondaryValues();
  }

  private buildDefaultPrimaryValues() {
    this.formGroup.patchValue({
      id: this.projectPrimary.id,
      summary: this.projectPrimary.summary,
      name: this.projectPrimary.name,
      shortForm: this.projectPrimary.shortForm,
      status: this.defaultStatus?.internalName,
      owner: this.projectPrimary.owner?.id,
    });
  }

  private buildDefaultSecondaryValues() {
    if (this.projectSecondary.description) {
      this.editorComponent.content = this.projectSecondary.description;
      this.editorComponent.writeValue(this.projectSecondary.description);
    }
    this.formGroup.patchValue({
      description: this.projectSecondary.description
    });
  }
}

