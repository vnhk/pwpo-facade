import {Component} from '@angular/core';
import {Item, ItemApi, ListComponent} from "../../main/list/list.component";
import {ProjectService} from "../service/project.service";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['../../main/list/list.component.css']
})
export class ProjectListComponent extends ListComponent {
  displayedColumns: string[] = ['shortForm', 'name', 'summary', 'status', "owner"];

  constructor(private projectService: ProjectService
  ) {
    super(projectService);
  }
}

