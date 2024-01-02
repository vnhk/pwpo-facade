import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LayoutComponent} from './main/layout/layout.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatSortModule} from "@angular/material/sort";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {TaskListComponent} from './tasks/task-list/task-list.component';
import {ProjectInfoComponent} from './projects/project-info/project-info.component';
import {ProjectDetailsComponent} from './projects/project-info/project-details/project-details.component';
import {DetailsComponent} from "./main/details/details.component";
import {MyWorkComponent} from './mywork/my-work/my-work.component';
import {CreateTaskComponent} from './tasks/create-task/create-task.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TaskInfoComponent} from "./tasks/task-info/task-info.component";
import {TaskDetailsComponent} from "./tasks/task-info/task-details/task-details.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {CreateProjectComponent} from "./projects/projects-page/create-project/create-project.component";
import {AddUserProjectComponent} from "./projects/add-user-project/add-user-project.component";
import {ProjectListComponent} from "./projects/projects-page/project-list/project-list.component";
import {ProjectUserListComponent} from "./projects/project-user-list/project-user-list.component";
import {TaskTimelogComponent} from './tasks/task-info/task-details/task-timelog/task-timelog.component';
import {
  AddTaskTimelogComponent
} from './tasks/task-info/task-details/task-timelog/add-task-timelog/add-task-timelog.component';
import {
  TaskTimelogListComponent
} from './tasks/task-info/task-details/task-timelog/task-timelog-list/task-timelog-list.component';
import {ProjectsPageComponent} from './projects/projects-page/projects-page.component';
import {ProjectChartsComponent} from './projects/project-info/project-charts/project-charts.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {EditProjectComponent} from "./projects/edit-project/edit-project.component";
import {ProjectHistoryListComponent} from "./projects/project-history/project-history-list-component";
import {
  ProjectHistoryDetailsComponent
} from "./projects/project-history/project-history-details/project-history-details.component";
import {
  ProjectHistoryDiffComponent
} from "./projects/project-history/project-history-diff/project-history-diff.component";
import {TodoComponent} from './mywork/todo/todo.component';
import {EditTaskComponent} from "./tasks/edit-task/edit-task.component";
import {MessageBarComponent} from './main/message-bar/message-bar.component';
import {LoginComponent} from './main/login/login.component';
import {AuthInterceptorService} from "./main/session/auth-interceptor-service";
import {SearchComponent} from './search/search/search.component';
import {AdminPageComponent} from './admin/admin-page/admin-page.component';
import {UserManageOptionModalComponent} from './admin/user-manage-option-modal/user-manage-option-modal.component';
import {ProfileComponent} from './profile/profile/profile.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {TaskHistoryDiffComponent} from "./tasks/task-history/task-history-diff/task-history-diff.component";
import {TaskHistoryDetailsComponent} from "./tasks/task-history/task-history-details/task-history-details.component";
import {TaskHistoryListComponent} from "./tasks/task-history/task-history-list-component";
import {ProjectGoalsRisksComponent} from './projects/project-info/project-goals-risks/project-goals-risks.component';
import {AttachmentsComponent} from './main/attachments/attachments.component';
import {
  GoalRiskManageOptionModalComponent
} from "./projects/project-info/project-goals-risks/goal-risk-manage-option-modal/goal-risk-manage-option-modal.component";
import {
  UserProjectManageOptionModalComponent
} from "./projects/project-user-list/user-manage-option-modal/user-project-manage-option-modal.component";
import {DataManagementComponent} from './admin/data-management/data-management.component';
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";

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
    TaskDetailsComponent,
    CreateProjectComponent,
    AddUserProjectComponent,
    ProjectUserListComponent,
    TaskTimelogComponent,
    AddTaskTimelogComponent,
    TaskTimelogListComponent,
    ProjectsPageComponent,
    EditProjectComponent,
    ProjectHistoryListComponent,
    ProjectHistoryDetailsComponent,
    ProjectHistoryDiffComponent,
    ProjectChartsComponent,
    EditTaskComponent,
    TodoComponent,
    MessageBarComponent,
    LoginComponent,
    SearchComponent,
    AdminPageComponent,
    UserManageOptionModalComponent,
    ProfileComponent,
    TaskHistoryDiffComponent,
    TaskHistoryDetailsComponent,
    TaskHistoryListComponent,
    ProjectGoalsRisksComponent,
    AttachmentsComponent,
    GoalRiskManageOptionModalComponent,
    UserProjectManageOptionModalComponent,
    DataManagementComponent
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
    MatSnackBarModule,
    MatExpansionModule,
    MatTooltipModule,
    MatListModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatProgressBarModule,
    NgxChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
