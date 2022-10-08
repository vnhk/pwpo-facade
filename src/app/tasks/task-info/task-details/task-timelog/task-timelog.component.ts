import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-task-timelog',
  templateUrl: './task-timelog.component.html',
  styleUrls: ['./task-timelog.component.css']
})
export class TaskTimelogComponent implements OnInit {
  panelOpenState: boolean = false;

  constructor(private location: Location) {
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
  }
}
