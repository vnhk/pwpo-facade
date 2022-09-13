import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProjectListComponent} from "./projects/project-list/project-list.component";
import {TaskListComponent} from "./tasks/task-list/task-list.component";
import {ProjectInfoComponent} from "./projects/project-info/project-info.component";
import {ProjectResolver} from "./projects/project.resolver";
import {MyWorkComponent} from "./mywork/my-work/my-work.component";
import {CreateTaskComponent} from "./tasks/create-task/create-task/create-task.component";

const routes: Routes = [
  {
    path: 'projects',
    component: ProjectListComponent,
    resolve:
      {
        ProjectResolver
      }
  },
  {
    path: 'my-work',
    component: MyWorkComponent
  },
  {
    path: 'project/:id/create-task',
    component: CreateTaskComponent
  },
  {path: 'projects/details/:id', component: ProjectInfoComponent},
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
