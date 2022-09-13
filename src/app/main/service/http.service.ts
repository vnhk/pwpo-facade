import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SortDirection} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {DataEnumApi, PersonApi, Project, ProjectApi, TaskApi} from "../api-models";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getProjects(sort: string, order: SortDirection, page: number): Observable<ProjectApi> {
    const params = this.toHttpParams(sort, order, page);

    return this.http.get<ProjectApi>(
      `${this.baseUrl}/projects`
    );
  }

  getTasks(sort: string, order: SortDirection, page: number): Observable<TaskApi> {
    const params = this.toHttpParams(sort, order, page);

    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks`
    );
  }

  getProjectByIdPrimaryAttr(id: string | null): Observable<Project> {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/project/${id}/primary-attributes`
    );
  }

  getProjectByIdSecondaryAttr(id: string | null): Observable<Project> {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/project/${id}/secondary-attributes`
    );
  }

  getEnumByName(name: string | null): Observable<DataEnumApi> {
    return this.http.get<DataEnumApi>(
      `${this.baseUrl}/enums/enum?name=${name}`
    );
  }

  getUsersWithAccessToTheProject(id: string | null): Observable<PersonApi> {
    return this.http.get<PersonApi>(
      `${this.baseUrl}/projects/project/${id}/users`
    );
  }

  private toHttpParams(sort: string, order: SortDirection, page: number) {

  }

  getTaskByIdSecondaryAttr(id: string | null): Observable<Task> {
    return this.http.get<Task>(
      `${this.baseUrl}/tasks/task/${id}/secondary-attributes`
    );
  }

  getAllTasksByProjectIdPrimaryAttr(id: string | null, sort: string, order: SortDirection, page: number): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/projects/project/${id}/tasks/primary-attributes`
    );
  }

  getAllTasksByProjectIdSecondaryAttr(id: string | null): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/projects/project/${id}/tasks/secondary-attributes`
    );
  }

  getAllTasksByOwner(username: string, active: string, direction: SortDirection, pageIndex: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks/search?owner=${username}`
    );
  }

  getAllTasksByAssignee(username: string, active: string, direction: SortDirection, pageIndex: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks/search?assignee=${username}`
    );
  }
}
