import {Component} from '@angular/core';
import {Item, ItemApi, ListComponent} from "../../main/list/list.component";
import {ProjectService} from "../../projects/service/project.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['../../main/list/list.component.css']
})
export class TaskListComponent extends ListComponent {
  displayedColumns: string[] = ['name'];

  constructor(projectService: ProjectService) {
    super(projectService);
  }
}

export interface TaskApi extends ItemApi {
  items: Task[];
}

export interface Task extends Item {
  deleted: boolean;
  shortForm: string;
  name: string;
  summary: string;
  status: string;
  owner: string;
}
