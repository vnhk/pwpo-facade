import {AfterViewInit, Component} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {Task} from "../../../main/api-models";
import {map} from "rxjs/operators";

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
    ["Task", "assets/tasks/icons/Task.png"]
  ]);

  constructor(private httpService: HttpService,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.id = this.route.snapshot.paramMap.get("id");
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
    });

    this.httpService.getTaskSecondaryById(this.id).subscribe(value => {
      this.secondaryAttributes = value.items[0];
      this.afterSecondaryLoaded();
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
    console.log(this.secondaryAttributes.estimation);
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
}
