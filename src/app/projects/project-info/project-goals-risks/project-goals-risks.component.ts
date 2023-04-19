import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpService} from "../../../main/service/http.service";
import {ItemApi} from "../../../main/api-models";
import {ActivatedRoute} from "@angular/router";

export interface GoalRisk {
  id: number;
  value: string;
  priority: number;
  type: string;
}

export interface GoalRiskApi extends ItemApi {
  items: GoalRisk[];
}


@Component({
  selector: 'app-project-goals-risks',
  templateUrl: './project-goals-risks.component.html',
  styleUrls: ['./project-goals-risks.component.css']
})
export class ProjectGoalsRisksComponent implements OnInit {

  goals: GoalRisk[] = [];
  risks: GoalRisk[] = [];
  displayedColumns: string[] = ['value', 'priority'];
  dataSourceGoals: MatTableDataSource<GoalRisk> = new MatTableDataSource();
  dataSourceRisks: MatTableDataSource<GoalRisk> = new MatTableDataSource();

  applyGoalsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGoals.filter = filterValue.trim().toLowerCase();
  }

  applyRisksFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRisks.filter = filterValue.trim().toLowerCase();
  }

  constructor(private httpService: HttpService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");

    this.httpService.getAllGoalsAndRisks(id).subscribe(
      value => {
        this.goals = value.items.filter(v => v.type == "GOAL");
        this.risks = value.items.filter(v => v.type == "RISK");

        this.dataSourceGoals = new MatTableDataSource(this.goals);
        this.dataSourceRisks = new MatTableDataSource(this.risks);
      }
    );
  }

}
