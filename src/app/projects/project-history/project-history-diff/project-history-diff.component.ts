import {AfterViewInit, Component} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {DiffWord, HistoryDiff, HistoryDiffApi} from "../../../main/api-models";
import {Location} from "@angular/common";

@Component({
  selector: 'app-history-diff',
  templateUrl: './project-history-diff.component.html',
  styleUrls: ['../../../main/details/details.component.css', './project-history-diff.component.css']
})
export class ProjectHistoryDiffComponent implements AfterViewInit {
  historyDiff: HistoryDiff = {};
  name: DiffWord[] = [];
  description: DiffWord[] = [];
  summary: DiffWord[] = [];
  owner: DiffWord[] = [];
  shortForm: DiffWord[] = [];

  constructor(private httpService: HttpService,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngAfterViewInit() {
    let projectId = this.route.snapshot.paramMap.get("id");
    let historyId = this.route.snapshot.paramMap.get("hid");

    this.httpService.getProjectHistoryDiff(projectId, historyId).subscribe(value => this.build(value));
  }

  private build(value: HistoryDiffApi) {
    this.historyDiff = value.items[0]
    this.name = this.getAttribute("name");
    this.description = this.getAttribute("description");
    this.summary = this.getAttribute("summary");
    this.owner = this.getAttribute("owner");
    this.shortForm = this.getAttribute("shortForm");
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
