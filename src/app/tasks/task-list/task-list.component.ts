import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {SessionService} from "../../main/session/session.service";
import {HttpService} from "../../main/service/http.service";
import {DataEnum, DataEnumApi, TaskListDisplayOption} from "../../main/api-models";


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['../../main/list/list.component.css']
})
export class TaskListComponent implements AfterViewInit {
  displayedColumns: string[] = ['type', 'number', 'summary', 'status', 'assignee', 'dueDate', 'priority'];

  MAX_SUMMARY_LENGTH: number = 30;

  data: Object[] = [];
  resultsLength = 0;
  panelOpenState = false;

  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @Input() criteria = 'projectId';

  //searchPreferences
  public STATUS_INDEX = 0;
  public PRIORITY_INDEX = 1;
  public TASKS_TYPE_INDEX = 2;
  allChecked: boolean[] = [false, false, false];
  searchOptions: TaskListDisplayOption[] = [
    {
      name: "Status",
      internalName: "com.pwpo.common.enums.Status",
      checked: false,
      subOptions: []
    },
    {
      name: "Priority",
      internalName: "com.pwpo.common.enums.Priority",
      checked: false,
      subOptions: []
    },
    {
      name: "TaskType",
      internalName: "com.pwpo.task.enums.TaskType",
      checked: false,
      subOptions: []
    }
  ];
  private priority: DataEnum[] = [];
  private status: DataEnum[] = [];
  private taskType: DataEnum[] = [];

  public constructor(private httpService: HttpService,
                     private route: ActivatedRoute,
                     private session: SessionService) {

  }

  ngAfterViewInit() {
    let projectId = this.route.snapshot.paramMap.get("id");
    this.initOptions();

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.searchOptions)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.getData(projectId).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.allFound;
          return data.items;
        }),
      ).subscribe(data => (this.data = data));
  };

//preferences
  initOptions(): void {
    this.httpService.getEnumByName("com.pwpo.common.enums.Priority").subscribe((value) => this.initPriority(value));
    this.httpService.getEnumByName("com.pwpo.task.enums.TaskType").subscribe((value) => this.initTaskType(value));
    this.httpService.getEnumByName("com.pwpo.common.enums.Status").subscribe((value) => this.initStatus(value));
  }

  someChecked(index: number): boolean {
    if (this.searchOptions[index].subOptions == null) {
      return false;
    } else {
      return this.searchOptions[index].subOptions.filter(t => t.checked).length > 0 && !this.allChecked[index];
    }
  }

  setAll(index: number, checked: boolean) {
    this.allChecked[index] = checked;
    if (this.searchOptions[index].subOptions == null) {
      return;
    }
    this.searchOptions[index].subOptions.forEach(t => (t.checked = checked));
  }

  updateAllChecked(index: number) {
    this.allChecked[index] = this.searchOptions[index].subOptions != null &&
      this.searchOptions[index].subOptions.every(t => t.checked);
  }

  initPriority(value: DataEnumApi) {
    this.priority = value.items;
    this.initPref(this.priority, this.PRIORITY_INDEX);
    this.refreshTable();
  }

  initTaskType(value: DataEnumApi) {
    this.taskType = value.items;
    this.initPref(this.taskType, this.TASKS_TYPE_INDEX);
    this.refreshTable();
  }

  initStatus(value: DataEnumApi) {
    this.status = value.items;
    this.initPref(this.status, this.STATUS_INDEX);
    this.refreshTable();
  }

  initPref(items: DataEnum[], OPTION_INDEX: number) {
    let localStorageDataIsValidAndActual = true;
    let item = localStorage.getItem("TASK_SEARCH_OPTION_PREF" + this.criteria.toUpperCase() + OPTION_INDEX);
    if (item !== null && item !== "") {
      let parsed: TaskListDisplayOption = JSON.parse(item);
      if (parsed.subOptions.length === items.length) {
        for (let p = 0; p < items.length; p++) {
          if (items[p].displayName !== parsed.subOptions[p].name || items[p].internalName !== parsed.subOptions[p].internalName) {
            localStorageDataIsValidAndActual = false;
            break;
          }
        }
        if (localStorageDataIsValidAndActual) {
          this.searchOptions[OPTION_INDEX] = parsed;
          return;
        }
      }
    }
    //clear
    localStorage.setItem("TASK_SEARCH_OPTION_PREF" + this.criteria.toUpperCase() + OPTION_INDEX, "");
    this.searchOptions[OPTION_INDEX].subOptions = Array(items.length);
    for (let op = 0; op < items.length; op++) {
      this.searchOptions[OPTION_INDEX].subOptions[op] = {
        name: items[op].displayName,
        internalName: items[op].internalName,
        checked: false,
        subOptions: []
      }
    }
  }

  getData(projectId: string | null) {
    let query = "";

    if (this.criteria === 'projectId') {
      query = this.getQuery(`(project.id EQUALS_OPERATION ${projectId})`);
    }

    if (this.criteria === 'assignee') {
      let user = this.session.getLoggedUser().username;
      query = this.getQuery(`(assignee.nick EQUALS_OPERATION ${user})`);
    }

    if (this.criteria === 'owner') {
      let user = this.session.getLoggedUser().username;
      query = this.getQuery(`(owner.nick EQUALS_OPERATION ${user})`);
    }

    return this.httpService.getAllTasksByQuery(query,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );
  }

  refreshTable() {
    this.paginator.page.emit();
  }

  getPreferencesAsString(options: TaskListDisplayOption[]): string {
    let internalNames = options.filter(op => op.checked).map(op => op.internalName).join(",");
    if (internalNames.length > 1) {
      return internalNames.toString();
    } else {
      return "EMPTY_VAL";
    }
  }

  savePreferencesAndRefreshTable() {
    localStorage.setItem("TASK_SEARCH_OPTION_PREF" + this.criteria.toUpperCase() + this.STATUS_INDEX, JSON.stringify(this.searchOptions[this.STATUS_INDEX]));
    localStorage.setItem("TASK_SEARCH_OPTION_PREF" + this.criteria.toUpperCase() + this.TASKS_TYPE_INDEX, JSON.stringify(this.searchOptions[this.TASKS_TYPE_INDEX]));
    localStorage.setItem("TASK_SEARCH_OPTION_PREF" + this.criteria.toUpperCase() + this.PRIORITY_INDEX, JSON.stringify(this.searchOptions[this.PRIORITY_INDEX]));

    this.panelOpenState = false;
    this.refreshTable();
  }

  private getQuery(firstQuery: string) {
    let query: string =
      `((((` +
      `${firstQuery} AND_OPERATOR ` +
      `(status IN_OPERATION ${this.getPreferencesAsString(this.searchOptions[this.STATUS_INDEX].subOptions)})) AND_OPERATOR ` +
      `(priority IN_OPERATION ${this.getPreferencesAsString(this.searchOptions[this.PRIORITY_INDEX].subOptions)})) AND_OPERATOR ` +
      `(type IN_OPERATION ${this.getPreferencesAsString(this.searchOptions[this.TASKS_TYPE_INDEX].subOptions)}`
      + `)))`;
    return query;
  }
}
