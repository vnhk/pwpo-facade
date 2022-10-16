import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {ChartData} from "../../../main/api-models";
import {LegendPosition} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-project-charts',
  templateUrl: './project-charts.component.html',
  styleUrls: ['./project-charts.component.css']
})
export class ProjectChartsComponent implements OnInit {

  taskTypes: ChartData[] = [];
  taskPriorities: ChartData[] = [];
  projectRoles: ChartData[] = [];
  position: LegendPosition = LegendPosition.Right;
  time: ChartData[] = [];

  constructor(private http: HttpService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    this.http.getProjectTaskTypeChartData(id).subscribe(value => this.taskTypes = value);
    this.http.getProjectTaskPriorityChartData(id).subscribe(value => this.taskPriorities = value);
    this.http.getProjectRolesChartData(id).subscribe(value => this.projectRoles = value);
    this.http.getProjectSumTimeChartData(id).subscribe(value => this.time = value);
  }

  axisDecimalFormat(val: number) {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }
}
