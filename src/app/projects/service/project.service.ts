import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SortDirection} from "@angular/material/sort";
import {HttpService} from "../../main/http.service";
import {HttpClient} from "@angular/common/http";
import {Item, ItemApi} from "../../main/list/list.component";

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

  getByIdPrimaryAttr(id: string | null): Observable<Item> {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/project/${id}/primary-attributes`
    );
  }

  getByIdSecondaryAttr(id: string | null): Observable<Item> {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/project/${id}/secondary-attributes`
    );
  }
}

export interface ProjectApi extends ItemApi {
  items: Project[];
}

export interface Project extends Item {
  name?: string;
  summary?: string;
  status?: string;
  description?: string;
  shortForm?: string;
  owner?: string;
  createdBy?: string;
  created?: string;
  modified?: string;
}

