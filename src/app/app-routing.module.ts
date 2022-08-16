import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProjectListComponent} from "./projects/project-list/project-list.component";

const routes: Routes = [
  { path: 'projects', component: ProjectListComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
