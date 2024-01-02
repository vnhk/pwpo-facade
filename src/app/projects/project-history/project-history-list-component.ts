import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../main/service/http.service";
import {ProjectHistory, ProjectHistoryApi} from "../../main/api-models";
import {Location} from "@angular/common";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-project-history-list',
  templateUrl: './project-history-list.component.html',
  styleUrls: ['./project-history-list.component.css']
})
export class ProjectHistoryListComponent implements AfterViewInit {
  length = 0;
  pageSize = 10;

  pageEvent: PageEvent | undefined;
  projectHistories: ProjectHistory[] = [];
  projectID: string | null | undefined;

  constructor(private http: HttpService,
              private location: Location,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.projectID = this.route.snapshot.paramMap.get("id");
    this.findProjectHistory();
  }

  goBack() {
    this.location.back();
  }

  pageChanged($event: PageEvent) {
    this.pageEvent = $event;
    this.findProjectHistory();
  }

  findProjectHistory() {
    let page = 1;
    if (this.pageEvent?.pageIndex != undefined) {
      //BE requires pages 1-X
      page = this.pageEvent.pageIndex + 1;
    }

    this.http.getProjectHistory(this.projectID, page, this.pageSize)
      .subscribe(value => this.setProjectHistory(value));
  }

  private setProjectHistory(value: ProjectHistoryApi) {
    this.projectHistories = value.items;
    this.length = value.allFound;
  }
}
