import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SortDirection} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {Person, PersonApi, Project, ProjectApi} from "../../main/api-models";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getItems(sort: string, order: SortDirection, page: number): Observable<ProjectApi> {
    const params = this.toHttpParams(sort, order, page);

    return this.http.get<ProjectApi>(
      `${this.baseUrl}/projects`
    );
  }

  getByIdPrimaryAttr(id: string | null): Observable<Project> {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/project/${id}/primary-attributes`
    );
  }

  getByIdSecondaryAttr(id: string | null): Observable<Project> {
    return this.http.get<Project>(
      `${this.baseUrl}/projects/project/${id}/secondary-attributes`
    );
  }

  getUsersWithAccessToTheProject(id: string | null): Observable<PersonApi> {
    return this.http.get<PersonApi>(
      `${this.baseUrl}/projects/project/${id}/users`
    );
  }

  private toHttpParams(sort: string, order: SortDirection, page: number) {

  }
}
