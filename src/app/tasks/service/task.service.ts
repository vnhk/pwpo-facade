import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SortDirection} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {Item, TaskApi} from "../../main/api-models";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getItems(sort: string, order: SortDirection, page: number): Observable<TaskApi> {
    const params = this.toHttpParams(sort, order, page);

    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks`
    );
  }

  getByIdPrimaryAttr(id: string | null): Observable<Task> {
    return this.http.get<Task>(
      `${this.baseUrl}/tasks/task/${id}/primary-attributes`
    );
  }

  getByIdSecondaryAttr(id: string | null): Observable<Task> {
    return this.http.get<Task>(
      `${this.baseUrl}/tasks/task/${id}/secondary-attributes`
    );
  }

  getAllByProjectIdPrimaryAttr(id: string | null, sort: string, order: SortDirection, page: number): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/projects/project/${id}/tasks/primary-attributes`
    );
  }

  getAllByProjectIdSecondaryAttr(id: string | null): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/projects/project/${id}/tasks/secondary-attributes`
    );
  }

  getAllByCreator(username: string, active: string, direction: SortDirection, pageIndex: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks/search?createdBy=${username}`
    );
  }

  getAllByAssignee(username: string, active: string, direction: SortDirection, pageIndex: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks/search?assignee=${username}`
    );
  }

  private toHttpParams(sort: string, order: SortDirection, page: number) {

  }
}

