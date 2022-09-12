import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SortDirection} from "@angular/material/sort";
import {HttpService} from "../../main/http.service";
import {HttpClient} from "@angular/common/http";
import {Item, ItemApi} from "../../main/list/item";

@Injectable({
  providedIn: 'root'
})
export class TaskService extends HttpService {
  private baseUrl = 'http://localhost:8080';

  constructor(http: HttpClient) {
    super(http);
  }

  getItems(sort: string, order: SortDirection, page: number): Observable<TaskApi> {
    const params = this.toHttpParams(sort, order, page);

    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks`
    );
  }

  getByIdPrimaryAttr(id: string | null): Observable<Item> {
    return this.http.get<Task>(
      `${this.baseUrl}/tasks/task/${id}/primary-attributes`
    );
  }

  getByIdSecondaryAttr(id: string | null): Observable<Item> {
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
}

export interface TaskApi extends ItemApi {
  items: Task[];
}

export interface Task extends Item {
  type?: string;
  number?: string;
  summary?: string;
  status?: string;
  assignee?: string;
  dueDate?: string;
  priority?: string;
  description?: string;
  estimation?: string;
  createdBy?: string;
  created?: string;
  modified?: string;
}

