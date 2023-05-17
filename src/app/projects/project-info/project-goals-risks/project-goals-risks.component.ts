import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpService} from "../../../main/service/http.service";
import {ItemApi} from "../../../main/api-models";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {
  GoalRiskManageOptionModalComponent
} from "./goal-risk-manage-option-modal/goal-risk-manage-option-modal.component";
import {AuthService} from "../../../main/session/auth.service";

export class GoalRisk {
  id: number | undefined;
  content: string | undefined;
  priority: number | undefined;
  type: string | undefined;
}

export class GoalRiskModal {
  projectId: string | null | undefined;
  data: GoalRisk | undefined;
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
  editRisks = false;
  editGoals = false;

  goals: GoalRisk[] = [];
  risks: GoalRisk[] = [];
  displayedColumns: string[] = ['content', 'priority'];
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

  constructor(private httpService: HttpService, private route: ActivatedRoute, public dialog: MatDialog, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.getGoalsAndRisks();
  }

  private getGoalsAndRisks() {
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

  openActionModal(row: GoalRisk) {
    if (this.authService.isManager()) {
      let id = this.route.snapshot.paramMap.get("id");
      let modalData = new GoalRiskModal();
      modalData.projectId = id;
      modalData.data = row;
      let matDialogRef = this.dialog.open(GoalRiskManageOptionModalComponent,
        {
          data: modalData,
        });

      matDialogRef.afterClosed().subscribe(() => {
        this.getGoalsAndRisks();
      });
    }
  }

  openActionModalForNotExisting(type: string) {
    let newGoalRisk = new GoalRisk();
    newGoalRisk.type = type;
    let id = this.route.snapshot.paramMap.get("id");
    let modalData = new GoalRiskModal();
    modalData.projectId = id;
    modalData.data = newGoalRisk;
    if (this.authService.isManager()) {
      let matDialogRef = this.dialog.open(GoalRiskManageOptionModalComponent,
        {
          data: modalData,
        });

      matDialogRef.afterClosed().subscribe(() => {
        this.getGoalsAndRisks();
      });
    }
  }

  showEditRisks() {
    this.editRisks = true;
  }

  showEditGoals() {
    this.editGoals = true;
  }

  hideEditRisks() {
    this.editRisks = false;
  }

  hideEditGoals() {
    this.editGoals = false;
  }
}
