import {AfterViewInit, Component} from '@angular/core';
import {HttpService} from "../../../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {TimeLog, TimeLogApi} from "../../../../../main/api-models";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-task-timelog-list',
  templateUrl: './task-timelog-list.component.html',
  styleUrls: ['./task-timelog-list.component.css']
})
export class TaskTimelogListComponent implements AfterViewInit {
  length = 0;
  pageSize = 5;

  pageEvent: PageEvent | undefined;
  timelogs: TimeLog[] = [];
  private id: string | null | undefined;

  constructor(private http: HttpService, private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.findTimeLogs();
  }

  pageChanged($event: PageEvent) {
    this.pageEvent = $event;
    this.findTimeLogs();
  }

  findTimeLogs() {
    let page = 1;
    if (this.pageEvent?.pageIndex != undefined) {
      //BE requires pages 1-X
      page = this.pageEvent.pageIndex + 1;
    }

    this.http.getTimelogs(this.id, page, this.pageSize)
      .subscribe(value => this.setTimeLogs(value));
  }

  private setTimeLogs(value: TimeLogApi) {
    this.timelogs = value.items;
    this.length = value.allFound;
  }
}
