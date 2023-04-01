import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TaskListComponent} from "./tasks/task-list/task-list.component";
import {ProjectInfoComponent} from "./projects/project-info/project-info.component";
import {MyWorkComponent} from "./mywork/my-work/my-work.component";
import {CreateTaskComponent} from "./tasks/create-task/create-task.component";
import {TaskInfoComponent} from "./tasks/task-info/task-info.component";
import {AddUserProjectComponent} from "./projects/add-user-project/add-user-project.component";
import {TaskTimelogComponent} from "./tasks/task-info/task-details/task-timelog/task-timelog.component";
import {ProjectsPageComponent} from "./projects/projects-page/projects-page.component";
import {EditProjectComponent} from "./projects/edit-project/edit-project.component";
import {ProjectHistoryListComponent} from "./projects/project-history/project-history-list-component";
import {ProjectHistoryDetailsComponent} from "./projects/project-history/project-history-details/project-history-details.component";
import {ProjectHistoryDiffComponent} from "./projects/project-history/project-history-diff/project-history-diff.component";
import {EditTaskComponent} from "./tasks/edit-task/edit-task.component";
import {LoginComponent} from "./main/login/login.component";
import {SignedInGuard} from "./main/session/signed-in.guard";
import {IsManagerGuard} from "./main/session/is-manager.guard";
import {SearchComponent} from "./search/search/search.component";
import {AdminPageComponent} from "./admin/admin-page/admin-page.component";
import {IsAdminGuard} from "./main/session/is-admin.guard";
import {ProfileComponent} from "./profile/profile/profile.component";
import {HasActivatedAccountGuard} from "./main/session/has-activated-account.guard";
import {TaskHistoryDiffComponent} from "./tasks/task-history/task-history-diff/task-history-diff.component";
import {TaskHistoryDetailsComponent} from "./tasks/task-history/task-history-details/task-history-details.component";
import {TaskHistoryListComponent} from "./tasks/task-history/task-history-list-component";

const routes: Routes = [
  {path: 'projects', component: ProjectsPageComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'my-work', component: MyWorkComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: '', component: MyWorkComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'projects/:id/create-task', component: CreateTaskComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'projects/:id/add-user', component: AddUserProjectComponent, canActivate: [SignedInGuard, IsManagerGuard, HasActivatedAccountGuard]},
  {path: 'projects/:id/edit', component: EditProjectComponent, canActivate: [SignedInGuard, IsManagerGuard, HasActivatedAccountGuard]},
  {path: 'tasks/:id/edit', component: EditTaskComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'projects/:id/history', component: ProjectHistoryListComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'projects/:id/history/:hid', component: ProjectHistoryDetailsComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'projects/:id/history/:hid/diff', component: ProjectHistoryDiffComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'tasks/:id/history', component: TaskHistoryListComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'tasks/:id/history/:hid', component: TaskHistoryDetailsComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'tasks/:id/history/:hid/diff', component: TaskHistoryDiffComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'projects/details/:id', component: ProjectInfoComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'tasks/:id/details', component: TaskInfoComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'tasks/:id/details/timelog', component: TaskTimelogComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'tasks', component: TaskListComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'search', component: SearchComponent, canActivate: [SignedInGuard, HasActivatedAccountGuard]},
  {path: 'admin', component: AdminPageComponent, canActivate: [SignedInGuard, IsAdminGuard, HasActivatedAccountGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [SignedInGuard]}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
