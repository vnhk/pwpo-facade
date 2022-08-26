import { Component } from '@angular/core';
import {HttpDatabase, Item, ItemApi, ListComponent} from "../../main/list/list.component";
import {HttpClient} from "@angular/common/http";
import {SortDirection} from "@angular/material/sort";
import {Observable} from "rxjs";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['../../main/list/list.component.css']
})
export class TaskListComponent extends ListComponent {
  displayedColumns: string[] = ['name'];

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getDB(httpClient: HttpClient): HttpDatabase {
    return new ProjectHttpDatabase(httpClient);
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

export class ProjectHttpDatabase extends HttpDatabase {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getList(sort: string, order: SortDirection, page: number): Observable<TaskApi> {
    const href = 'http://localhost:8080/projects';
    const requestUrl = href;

    return this._httpClient.get<TaskApi>(requestUrl);
  }
}
