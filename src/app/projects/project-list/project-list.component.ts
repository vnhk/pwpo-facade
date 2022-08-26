import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {SortDirection} from '@angular/material/sort';
import {Observable} from 'rxjs';
import {HttpDatabase, Item, ItemApi, ListComponent} from "../../main/list/list.component";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['../../main/list/list.component.css']
})
export class ProjectListComponent extends ListComponent {
  displayedColumns: string[] = ['shortForm', 'name', 'summary', 'status', "owner"];

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getDB(httpClient: HttpClient): HttpDatabase {
    return new ProjectHttpDatabase(httpClient);
  }
}

export interface ProjectApi extends ItemApi {
  items: Project[];
}

export interface Project extends Item {
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

  getList(sort: string, order: SortDirection, page: number): Observable<ProjectApi> {
    const href = 'http://localhost:8080/projects';
    const requestUrl = href;

    return this._httpClient.get<ProjectApi>(requestUrl);
  }
}
