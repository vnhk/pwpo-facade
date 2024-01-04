import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {DataEnum, Task, TaskStructureItem} from "../../../main/api-models";
import {catchError, map} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../../../main/details/details.component.css', "./task-details.component.css"]
})
export class TaskDetailsComponent implements AfterViewInit {
  primaryAttributes: Task = {};
  secondaryAttributes: Task = {};
  today = new Date();
  dueDateExceeded = false;
  dueDateComingUp = false;
  oneDay = 24 * 60 * 60;
  estimationText: string = "";
  loggedTimeText: string = "";
  loggedTime = 0;
  estimation = 0;
  loggedTimeProgressBar = 0;
  id: string | null | undefined;
  avatar = "assets/tasks/icons/Task.png";
  avatars = new Map<string, string>([
    ["Story", "assets/tasks/icons/Story.png"],
    ["Objective", "assets/tasks/icons/Objective.png"],
    ["Feature", "assets/tasks/icons/Feature.png"],
    ["Bug", "assets/tasks/icons/Bug.png"],
    ["Task", "assets/tasks/icons/Task.png"]
  ]);
  currentUserAssigned = true;
  status: DataEnum[] = [];
  statusChangeOperation = false;

  uploadFileAccessGranted = true;
  downloadFileAccessGranted = true;
  removeFileAccessGranted = true;
  loadingStructure = true;
  taskStructureItems: TaskStructureItem[] = [];

  constructor(private httpService: HttpService,
              private route: ActivatedRoute,
              public snackBar: MatSnackBar) {
  }

  ngAfterViewInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    this.httpService.getEnumByName("com.pwpo.common.enums.Status").subscribe((value) => this.status = value.items);

    this.loadPrimary();

    this.httpService.getTaskOneLvlStructure(this.id).subscribe(value => {
      this.taskStructureItems = value.items;
      this.loadingStructure = false;
    });

    this.httpService.getTaskSecondaryById(this.id).subscribe(value => {
      this.secondaryAttributes = value.items[0];
      this.afterSecondaryLoaded();
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  private loadPrimary() {
    if (!this.id) {
      return;
    }

    this.httpService.getTaskPrimaryById(this.id)
      .pipe(
        map((data) => {
          data.items[0].dueDate = new Date(Date.parse(data.items[0].dueDate));
          return data;
        })
      ).subscribe((value) => {
      this.primaryAttributes = value.items[0];
      this.afterPrimaryLoaded();
      this.setAvatarSrc();
      this.checkIfAssigned();
    });
  }

  private setAvatarSrc() {
    let avatarSrc;
    if (this.primaryAttributes.type != undefined) {
      avatarSrc = this.avatars.get(this.primaryAttributes.type);
    }

    if (avatarSrc) {
      this.avatar = avatarSrc;
    }
  }

  private afterPrimaryLoaded() {
    if (this.primaryAttributes.dueDate != undefined) {
      console.log(this.primaryAttributes.dueDate);
      if (this.primaryAttributes.dueDate.getTime() <= this.today.getTime()) {
        this.dueDateExceeded = true;
      } else if (this.primaryAttributes.dueDate.getTime() - this.today.getTime() <= this.oneDay) {
        this.dueDateComingUp = true;
      }
    }
  }

  private afterSecondaryLoaded() {
    if (this.secondaryAttributes.estimation != undefined) {
      this.estimation = this.secondaryAttributes.estimation;
      this.estimationText = this.getTimeText(this.estimation);
    }

    this.httpService.getLoggedTime(this.id).subscribe(value => {
      this.loggedTime = value;
      this.afterLoggedTimeLoaded();
    })
  }

  private afterLoggedTimeLoaded() {
    this.loggedTimeText = this.getTimeText(this.loggedTime);
    this.loggedTimeProgressBar = this.loggedTime / this.estimation * 100;
  }

  private getTimeText(minutesVal: number) {
    let text = "";
    if (minutesVal >= 60) {
      let minutes = minutesVal % 60;
      let hours = parseInt(String((minutesVal - (minutes)) / 60), 10);
      text = hours + "h ";
      if (minutes > 0) {
        text += minutes + "m";
      }
    } else {
      text = minutesVal + "m";
    }

    return text;
  }

  assignTask() {
    this.httpService.assignTask(this.id)
      .pipe(
        catchError(this.handleError.bind(this))
      ).subscribe(() => {
      this.successCreation("Task assigned")
      this.loadPrimary();
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.showErrorPopup('Could not perform operation. Contact with administrator!');

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private successCreation(msg: string) {
    this.openBarWithMessage(msg, ['success-bar'], 15000);
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

  private checkIfAssigned() {
    let user = localStorage.getItem("username");
    if (user) {
      this.currentUserAssigned = user === this.primaryAttributes.assignee?.nick;
    }
  }

  showChangeStatusForm() {
    this.statusChangeOperation = true;
  }

  changeStatus(status: string) {
    this.httpService.changeStatus({id: this.id, status: status})
      .pipe(
        catchError(this.handleError.bind(this))
      ).subscribe(() => {
      this.successCreation("Status changed")
      this.loadPrimary();
      this.statusChangeOperation = false;
    });
  }
}
