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

const routes: Routes = [
  {path: 'projects', component: ProjectsPageComponent, canActivate: [SignedInGuard]},
  {path: 'my-work', component: MyWorkComponent, canActivate: [SignedInGuard]},
  {path: '', component: MyWorkComponent, canActivate: [SignedInGuard]},
  {path: 'projects/:id/create-task', component: CreateTaskComponent, canActivate: [SignedInGuard]},
  {path: 'projects/:id/add-user', component: AddUserProjectComponent, canActivate: [SignedInGuard, IsManagerGuard]},
  {path: 'projects/:id/edit', component: EditProjectComponent, canActivate: [SignedInGuard, IsManagerGuard]},
  {path: 'tasks/:id/edit', component: EditTaskComponent, canActivate: [SignedInGuard]},
  {path: 'projects/:id/history', component: ProjectHistoryListComponent, canActivate: [SignedInGuard]},
  {path: 'projects/:id/history/:hid', component: ProjectHistoryDetailsComponent, canActivate: [SignedInGuard]},
  {path: 'projects/:id/history/:hid/diff', component: ProjectHistoryDiffComponent, canActivate: [SignedInGuard]},
  {path: 'projects/details/:id', component: ProjectInfoComponent, canActivate: [SignedInGuard]},
  {path: 'tasks/:id/details', component: TaskInfoComponent, canActivate: [SignedInGuard]},
  {path: 'tasks/:id/details/timelog', component: TaskTimelogComponent, canActivate: [SignedInGuard]},
  {path: 'tasks', component: TaskListComponent, canActivate: [SignedInGuard]},
  {path: 'search', component: SearchComponent, canActivate: [SignedInGuard]},
  {path: 'admin', component: AdminPageComponent, canActivate: [SignedInGuard, IsAdminGuard]},
  {path: 'login', component: LoginComponent}
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
