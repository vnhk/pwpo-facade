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
  private projectClass = "com.pwpo.project.Project";
  private projectDTOPrimaryClass = "com.pwpo.project.dto.ProjectPrimaryResponseDTO";
  private projectDTOSecondaryClass = "com.pwpo.project.dto.ProjectSecondaryResponseDTO";
  private taskClass = "com.pwpo.task.Task";
  private taskDTOPrimaryClass = "com.pwpo.task.dto.TaskPrimaryResponseDTO";
  private taskDTOSecondaryClass = "com.pwpo.task.dto.TaskSecondaryResponseDTO";

  constructor(private http: HttpClient) {
  }

  getProjects(sort: string, order: SortDirection, page: number, pageSize: number): Observable<ProjectApi> {
    return this.http.get<ProjectApi>(
      `${this.baseUrl}/projects?sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}&entityToFind=${this.projectClass}`
    );
  }

  getTasks(sort: string, order: SortDirection, page: number): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks`
    );
  }

  getProjectByIdPrimaryAttr(id: string | null): Observable<ProjectApi> {
    return this.http.get<ProjectApi>(
      `${this.baseUrl}/projects/project?id=${id}&dto=${this.projectDTOPrimaryClass}`
    );
  }

  getProjectByIdSecondaryAttr(id: string | null): Observable<ProjectApi> {
    return this.http.get<ProjectApi>(
      `${this.baseUrl}/projects/project?id=${id}&dto=${this.projectDTOSecondaryClass}`
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

  getAllTasksByProjectIdPrimaryAttr(id: string | null, sort: string, order: SortDirection, page: number, pageSize: number): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/projects/project/${id}/tasks` +
      `?sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}` +
      `&entityToFind=${this.taskClass}&dto=${this.taskDTOPrimaryClass}`
    );
  }

  getAllTasksByProjectIdSecondaryAttr(id: string | null, sort: string, order: SortDirection, page: number, pageSize: number): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/projects/project/${id}/tasks` +
      `?sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}` +
      `&entityToFind=${this.taskClass}&dto=${this.taskDTOSecondaryClass}`
    );
  }

  getAllTasksByOwner(username: string, active: string, direction: SortDirection, page: number, pageSize: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks/search?owner=${username}`
    );
  }

  getAllTasksByAssignee(username: string, active: string, direction: SortDirection, page: number, pageSize: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks/search?assignee=${username}`
    );
  }

  createTask(value: string) {
    return this.http.post<Task>(
      `${this.baseUrl}/tasks`,
      value
    );
  }
}
