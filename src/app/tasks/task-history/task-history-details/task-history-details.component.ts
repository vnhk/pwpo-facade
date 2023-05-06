import {AfterViewInit, Component} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {TaskHistory} from "../../../main/api-models";
import {Location} from "@angular/common";

@Component({
  selector: 'app-history-details',
  templateUrl: './task-history-details.component.html',
  styleUrls: ['../../../main/details/details.component.css']
})
export class TaskHistoryDetailsComponent implements AfterViewInit {
  taskHistory: TaskHistory = {};
  taskId: string | null | undefined;
  historyId: string | null | undefined;

  constructor(private httpService: HttpService,
              private location: Location,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.taskId = this.route.snapshot.paramMap.get("id");
    this.historyId = this.route.snapshot.paramMap.get("hid");

    this.httpService.getTaskHistoryDetails(this.taskId, this.historyId).subscribe(value => this.taskHistory = value.items[0]);
  }

  goBack() {
    this.location.back();
  }
}
