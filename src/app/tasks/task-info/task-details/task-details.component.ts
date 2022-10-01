import {AfterViewInit, Component} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {Task} from "../../../main/api-models";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../../../main/details/details.component.css']
})
export class TaskDetailsComponent implements AfterViewInit {
  primaryAttributes: Task = {};
  secondaryAttributes: Task = {};
  today = new Date();
  dueDateExceeded = false;
  dueDateComingUp = false;
  oneDay = 24 * 60 * 60;

  constructor(private httpService: HttpService,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    let id = this.route.snapshot.paramMap.get("id");
    this.httpService.getTaskPrimaryById(id)
      .pipe(
        map((data) => {
          data.items[0].dueDate = new Date(Date.parse(data.items[0].dueDate));
          return data;
        })
      ).subscribe((value) => {
      this.primaryAttributes = value.items[0];
      this.afterPrimaryLoaded();
    });
    this.httpService.getTaskSecondaryById(id).subscribe(value => this.secondaryAttributes = value.items[0]);
  }

  afterPrimaryLoaded() {
    if (this.primaryAttributes.dueDate != undefined) {
      console.log(this.primaryAttributes.dueDate);
      if (this.primaryAttributes.dueDate.getTime() <= this.today.getTime()) {
        this.dueDateExceeded = true;
      } else if (this.primaryAttributes.dueDate.getTime() - this.today.getTime() <= this.oneDay) {
        this.dueDateComingUp = true;
      }
    }
  }
}
