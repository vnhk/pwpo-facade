import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LayoutComponent} from './main/layout/layout.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {ProjectListComponent} from './projects/project-list/project-list.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {TaskListComponent} from './tasks/task-list/task-list.component';
import {ProjectInfoComponent} from './projects/project-info/project-info.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from "@angular/material/card";
import {ProjectDetailsComponent} from './projects/project-info/project-details/project-details.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {DetailsComponent} from "./main/details/details.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import {MyWorkComponent} from './mywork/my-work/my-work.component';
import {CreateTaskComponent} from './tasks/create-task/create-task.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TaskInfoComponent} from "./tasks/task-info/task-info.component";
import {TaskDetailsComponent} from "./tasks/task-info/task-details/task-details.component";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ProjectListComponent,
    TaskListComponent,
    ProjectInfoComponent,
    ProjectDetailsComponent,
    DetailsComponent,
    MyWorkComponent,
    CreateTaskComponent,
    TaskInfoComponent,
    TaskDetailsComponent
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    AppRoutingModule,
    MatTabsModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgSelectModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
