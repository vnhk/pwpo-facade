import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SortDirection} from "@angular/material/sort";
import {HttpService} from "../../main/http.service";
import {HttpClient} from "@angular/common/http";
import {Project, ProjectApi} from "../project-list/project-list.component";
import {Item} from "../../main/list/list.component";

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends HttpService {
  private baseUrl = 'http://localhost:8080';

  constructor(http: HttpClient) {
    super(http);
  }

  getItems(sort: string, order: SortDirection, page: number): Observable<ProjectApi> {
    const params = this.toHttpParams(sort, order, page);

    return this.http.get<ProjectApi>(
      `${this.baseUrl}/projects`
    );
  }

  getById(id: string | null): Observable<Item> {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/project/${id}`
    );
  }
}
