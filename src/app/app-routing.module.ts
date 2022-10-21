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

const routes: Routes = [
  {path: 'projects', component: ProjectsPageComponent},
  {path: 'my-work', component: MyWorkComponent},
  {path: 'projects/:id/create-task', component: CreateTaskComponent},
  {path: 'projects/:id/add-user', component: AddUserProjectComponent},
  {path: 'projects/:id/edit', component: EditProjectComponent},
  {path: 'projects/:id/history', component: ProjectHistoryListComponent},
  {path: 'projects/:id/history/:hid', component: ProjectHistoryDetailsComponent},
  {path: 'projects/:id/history/:hid/diff', component: ProjectHistoryDiffComponent},
  {path: 'projects/details/:id', component: ProjectInfoComponent},
  {path: 'tasks/:id/details', component: TaskInfoComponent},
  {path: 'tasks/:id/details/timelog', component: TaskTimelogComponent},
  {path: 'tasks', component: TaskListComponent}
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
