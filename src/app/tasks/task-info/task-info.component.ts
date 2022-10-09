import {Component} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css']
})
export class TaskInfoComponent {

  constructor(private location: Location) {
  }

  goBack() {
    this.location.back();
  }
}
