import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SortDirection} from "@angular/material/sort";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  AuthResponse,
  ChartData,
  DataEnumApi,
  HistoryDiffApi,
  Item,
  ItemApi,
  Person,
  PersonApi,
  Project,
  ProjectApi,
  ProjectHistoryApi,
  SearchRequest,
  Task,
  TaskApi,
  TaskHistoryApi,
  TaskListDisplayOption,
  TimeLogApi,
  TimeLogRequest,
  UserProject
} from "../api-models";
import {GoalRiskApi} from "../../projects/project-info/project-goals-risks/project-goals-risks.component";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = 'http://localhost:8081';
  private projectClass = "com.pwpo.project.model.Project";
  private projectDTOPrimaryClass = "com.pwpo.project.dto.ProjectPrimaryResponseDTO";
  private projectDTOSecondaryClass = "com.pwpo.project.dto.ProjectSecondaryResponseDTO";
  private taskClass = "com.pwpo.task.model.Task";
  private taskDTOPrimaryClass = "com.pwpo.task.dto.TaskPrimaryResponseDTO";
  private taskDTOSecondaryClass = "com.pwpo.task.dto.TaskSecondaryResponseDTO";

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  doesProjectExist(id: string | null): Observable<Boolean> {
    return this.http.get<Boolean>(
      `${this.baseUrl}/projects/project/${id}/exists`
    );
  }

  getProjects(sort: string, order: SortDirection, page: number, pageSize: number): Observable<ProjectApi> {
    return this.http.get<ProjectApi>(
      `${this.baseUrl}/projects?sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}&entityToFind=${this.projectClass}`,
      this.httpOptions
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

  getUsersWithAccessToTheProject(id: string | null | undefined, sort: string, order: SortDirection, page: number, pageSize: number): Observable<PersonApi> {
    return this.http.get<PersonApi>(
      `${this.baseUrl}/projects/project/${id}/users?sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}`
    );
  }

  getUsersNotAddedToTheProject(id: string | null | undefined): Observable<PersonApi> {
    return this.http.get<PersonApi>(
      `${this.baseUrl}/projects/project/${id}/users-not-added`
    );
  }

  getAllUsers(): Observable<PersonApi> {
    return this.http.get<PersonApi>(
      `${this.baseUrl}/users`
    );
  }

  getAllUsersWithRoles(): Observable<PersonApi> {
    return this.http.get<PersonApi>(
      `${this.baseUrl}/admin/users`
    );
  }

  getTimelogs(taskId: string | null | undefined, page: number, pageSize: number): Observable<TimeLogApi> {
    return this.http.get<TimeLogApi>(
      `${this.baseUrl}/tasks/task/${taskId}/timelogs?page=${page}&pageSize=${pageSize}`
    );
  }

  getProjectHistory(projectId: string | null | undefined, page: number, pageSize: number): Observable<ProjectHistoryApi> {
    return this.http.get<ProjectHistoryApi>(
      `${this.baseUrl}/projects/${projectId}/history?page=${page}&pageSize=${pageSize}&sortField=expired&sortDirection=DESC`
    );
  }

  getProjectHistoryDetails(projectId: string | null | undefined, historyId: string | null | undefined): Observable<ProjectHistoryApi> {
    return this.http.get<ProjectHistoryApi>(
      `${this.baseUrl}/projects/${projectId}/history/${historyId}`
    );
  }

  getProjectHistoryDiff(projectId: string | null | undefined, historyId: string | null | undefined): Observable<HistoryDiffApi> {
    return this.http.get<HistoryDiffApi>(
      `${this.baseUrl}/projects/${projectId}/history/${historyId}/compare`
    );
  }

  getTaskHistory(taskId: string | null | undefined, page: number, pageSize: number): Observable<TaskHistoryApi> {
    return this.http.get<TaskHistoryApi>(
      `${this.baseUrl}/tasks/${taskId}/history?page=${page}&pageSize=${pageSize}&sortField=expired&sortDirection=DESC`
    );
  }

  getTaskHistoryDetails(taskId: string | null | undefined, historyId: string | null | undefined): Observable<TaskHistoryApi> {
    return this.http.get<TaskHistoryApi>(
      `${this.baseUrl}/tasks/${taskId}/history/${historyId}`
    );
  }

  getAllGoalsAndRisks(projectId: string | null | undefined): Observable<GoalRiskApi> {
    return this.http.get<GoalRiskApi>(
      `${this.baseUrl}/projects/${projectId}/goals-and-risks?sortDirection=DESC`
    );
  }

  getTaskHistoryDiff(taskId: string | null | undefined, historyId: string | null | undefined): Observable<HistoryDiffApi> {
    return this.http.get<HistoryDiffApi>(
      `${this.baseUrl}/tasks/${taskId}/history/${historyId}/compare`
    );
  }

  getLoggedTime(taskId: string | null | undefined): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/tasks/task/${taskId}/timelogs/logged-time`
    );
  }

  getAllTasksByProjectIdPrimaryAttr(id: string | null, searchOptions: TaskListDisplayOption[], sort: string,
                                    order: SortDirection, page: number, pageSize: number): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/projects/project/${id}/tasks` +
      `?sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}` +
      `&entityToFind=${this.taskClass}&dto=${this.taskDTOPrimaryClass}`
    );
  }

  getAllTasksByProjectIdSecondaryAttr(id: string | null, sort: string, order: SortDirection,
                                      page: number, pageSize: number): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/projects/project/${id}/tasks` +
      `?sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}` +
      `&entityToFind=${this.taskClass}&dto=${this.taskDTOSecondaryClass}`
    );
  }

  getAllTasksByQuery(query: string, sort: string, order: SortDirection, page: number, pageSize: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/search?query=${query}` +
      `&sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}` +
      `&entityToFind=${this.taskClass}&dto=${this.taskDTOPrimaryClass}`
    );
  }

  getAllTasksByOwner(username: string, searchOptions: TaskListDisplayOption[], sort: string, order: SortDirection,
                     page: number, pageSize: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/search?query=(owner.nick EQUALS_OPERATION ${username})` +
      `&sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}` +
      `&entityToFind=${this.taskClass}&dto=${this.taskDTOPrimaryClass}`
    );
  }

  getAllTasksByAssignee(username: string, searchOptions: TaskListDisplayOption[], sort: string, order: SortDirection,
                        page: number, pageSize: number) {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/search?query=(assignee.nick EQUALS_OPERATION ${username})` +
      `&sortDirection=${order.toUpperCase()}&sortField=${sort}&page=${page}&pageSize=${pageSize}` +
      `&entityToFind=${this.taskClass}&dto=${this.taskDTOPrimaryClass}`
    );
  }

  createTask(value: string) {
    return this.http.post<Task>(
      `${this.baseUrl}/tasks`,
      value
    );
  }

  createProject(value: string) {
    return this.http.post<Project>(
      `${this.baseUrl}/projects`,
      value
    );
  }

  editProject(value: string) {
    return this.http.put<Project>(
      `${this.baseUrl}/projects`,
      value
    );
  }

  editTask(value: string) {
    return this.http.put<Task>(
      `${this.baseUrl}/tasks`,
      value
    );
  }

  editUser(value: string) {
    return this.http.put<Task>(
      `${this.baseUrl}/admin/users`,
      value
    );
  }

  getTaskPrimaryById(id: string | null): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks/task?id=${id}&dto=${this.taskDTOPrimaryClass}`
    );
  }

  getTaskSecondaryById(id: string | null): Observable<TaskApi> {
    return this.http.get<TaskApi>(
      `${this.baseUrl}/tasks/task?id=${id}&dto=${this.taskDTOSecondaryClass}`
    );
  }

  addUserToProject(value: string, id: string | null | undefined) {
    return this.http.post<UserProject>(
      `${this.baseUrl}/projects/project/${id}/users`,
      value
    );
  }

  logTime(value: string, taskId: string | null | undefined) {
    return this.http.post<TimeLogRequest>(
      `${this.baseUrl}/tasks/task/${taskId}/timelogs`,
      value
    );
  }

  getProjectTaskTypeChartData(id: string | null): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(
      `${this.baseUrl}/projects/project/${id}/visualization/task-types`
    );
  }

  getProjectTaskPriorityChartData(id: string | null): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(
      `${this.baseUrl}/projects/project/${id}/visualization/task-priorities`
    );
  }

  getProjectRolesChartData(id: string | null): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(
      `${this.baseUrl}/projects/project/${id}/visualization/project-roles`
    );
  }

  getProjectSumTimeChartData(id: string | null): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(
      `${this.baseUrl}/projects/project/${id}/visualization/sum-time`
    );
  }

  search(search: SearchRequest): Observable<ItemApi> {
    return this.http.post<ItemApi>(
      `${this.baseUrl}/search`,
      search
    );
  }

  disableAccount(id: number | undefined) {
    return this.http.post<Item>(
      `${this.baseUrl}/admin/users/disable/${id}`,
      null
    );
  }

  enableAccount(id: number | undefined) {
    return this.http.post<Item>(
      `${this.baseUrl}/admin/users/enable/${id}`,
      null
    );
  }

  resetPassword(nick: string | undefined) {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/reset-password`,
      {nick: nick}
    );
  }

  assignTask(id: string | null | undefined) {
    return this.http.put(
      `${this.baseUrl}/tasks/${id}/assign`,
      null
    );
  }

  changeStatus(value: any) {
    return this.http.put(
      `${this.baseUrl}/tasks/status`,
      value
    );
  }

  changePassword(value: any) {
    return this.http.post(
      `${this.baseUrl}/auth/change-password`,
      value
    );
  }

  getLoggedUserDetails() {
    return this.http.get<Person>(
      `${this.baseUrl}/users/logged/details`
    );
  }

  saveGoalRisk(projectId: string | null | undefined, value: any) {
    return this.http.post(
      `${this.baseUrl}/projects/${projectId}/goals-and-risks`,
      value
    );
  }

  deleteGoalRisk(projectId: string | null | undefined, id: any) {
    return this.http.delete(
      `${this.baseUrl}/projects/${projectId}/goals-and-risks/${id}`
    );
  }
}
