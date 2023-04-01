import {AfterViewInit, Component} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {DiffWord, HistoryDiff, HistoryDiffApi} from "../../../main/api-models";
import {Location} from "@angular/common";

@Component({
  selector: 'app-history-diff',
  templateUrl: './task-history-diff.component.html',
  styleUrls: ['../../../main/details/details.component.css', './task-history-diff.component.css']
})
export class TaskHistoryDiffComponent implements AfterViewInit {
  historyDiff: HistoryDiff = {};
  assignee: DiffWord[] = [];
  type: DiffWord[] = [];
  description: DiffWord[] = [];
  summary: DiffWord[] = [];
  status: DiffWord[] = [];
  dueDate: DiffWord[] = [];
  estimation: DiffWord[] = [];
  owner: DiffWord[] = [];
  priority: DiffWord[] = [];

  constructor(private httpService: HttpService,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngAfterViewInit() {
    let taskId = this.route.snapshot.paramMap.get("id");
    let historyId = this.route.snapshot.paramMap.get("hid");

    this.httpService.getTaskHistoryDiff(taskId, historyId).subscribe(value => this.build(value));
  }

  private build(value: HistoryDiffApi) {
    this.historyDiff = value.items[0]
    this.description = this.getAttribute("description");
    this.summary = this.getAttribute("summary");
    this.owner = this.getAttribute("owner");
    this.assignee = this.getAttribute("assignee");
    this.priority = this.getAttribute("priority");
    this.dueDate = this.getAttribute("dueDate");
    this.status = this.getAttribute("status");
    this.type = this.getAttribute("type");
    this.estimation = this.getAttribute("estimation");
  }


  private getAttribute(attrName: string): DiffWord[] {
    let diff = this.historyDiff.diff?.filter(e => e.attribute === attrName)[0].diff;
    if (diff) {
      return diff;
    }
    return [];
  }

  getDiffClass(type: string) {
    if (type === "REMOVED") {
      return "diff-removed";
    } else if (type === "ADDED") {
      return "diff-added";
    }

    return "";
  }

  goBack() {
    this.location.back();
  }
}
