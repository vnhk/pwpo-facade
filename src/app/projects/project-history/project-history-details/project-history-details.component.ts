import {AfterViewInit, Component} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {ProjectHistory} from "../../../main/api-models";
import {Location} from "@angular/common";

@Component({
  selector: 'app-history-details',
  templateUrl: './project-history-details.component.html',
  styleUrls: ['../../../main/details/details.component.css']
})
export class ProjectHistoryDetailsComponent implements AfterViewInit {
  projectHistory: ProjectHistory = {};
  projectId: string | null | undefined;
  historyId: string | null | undefined;

  constructor(private httpService: HttpService,
              private location: Location,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.projectId = this.route.snapshot.paramMap.get("id");
    this.historyId = this.route.snapshot.paramMap.get("hid");

    this.httpService.getProjectHistoryDetails(this.projectId, this.historyId).subscribe(value => this.projectHistory = value.items[0]);
  }

  goBack() {
    this.location.back();
  }
}
