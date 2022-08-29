import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProjectListComponent} from "./projects/project-list/project-list.component";
import {TaskListComponent} from "./tasks/task-list/task-list.component";
import {ProjectInfoComponent} from "./projects/project-info/project-info.component";
import {ProjectResolver} from "./projects/project.resolver";

const routes: Routes = [
  {
    path: 'projects',
    component: ProjectListComponent,
    resolve:
      {
        ProjectResolver
      }
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
