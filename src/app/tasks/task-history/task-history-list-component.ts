import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../main/service/http.service";
import {ProjectHistory, ProjectHistoryApi} from "../../main/api-models";
import {Location} from "@angular/common";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-project-history-list',
  templateUrl: './task-history-list.component.html',
  styleUrls: ['./task-history-list.component.css']
})
export class TaskHistoryListComponent implements AfterViewInit {
  length = 0;
  pageSize = 10;

  pageEvent: PageEvent | undefined;
  taskHistories: ProjectHistory[] = [];
  taskId: string | null | undefined;

  constructor(private http: HttpService,
              private location: Location,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.taskId = this.route.snapshot.paramMap.get("id");
    this.findTaskHistory();
  }

  goBack() {
    this.location.back();
  }

  pageChanged($event: PageEvent) {
    this.pageEvent = $event;
    this.findTaskHistory();
  }

  findTaskHistory() {
    let page = 1;
    if (this.pageEvent?.pageIndex != undefined) {
      //BE requires pages 1-X
      page = this.pageEvent.pageIndex + 1;
    }

    this.http.getTaskHistory(this.taskId, page, this.pageSize)
      .subscribe(value => this.setTaskHistory(value));
  }

  private setTaskHistory(value: ProjectHistoryApi) {
    this.taskHistories = value.items;
    this.length = value.allFound;
  }
}
