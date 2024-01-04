import {Component, HostListener, Input, OnInit} from '@angular/core';
import {TaskStructureItem} from "../api-models";
import {HttpService} from "../service/http.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-task-relation-list',
  templateUrl: './task-relation-list.component.html',
  styleUrls: ['./task-relation-list.component.css']
})
export class TaskRelationListComponent implements OnInit {

  tasks: TaskStructureItem[] | undefined;
  children: TaskStructureItem[] = [];
  parent: TaskStructureItem | undefined;
  @Input()
  listName: string = "";
  @Input()
  taskNumber: string | undefined;
  openedTaskId: string | undefined;

  allDisplayedColumns: string[] = ['number', 'summary', 'relation'];
  displayedColumns: string[] = this.allDisplayedColumns;

  MAX_SUMMARY_LENGTH: number = 50;

  constructor(private httpService: HttpService, private route: ActivatedRoute) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    let width = event.target.innerWidth;
    this.setDisplayedColumns(width);
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.openedTaskId = id;
    }

    if (this.openedTaskId) {
      this.httpService.getTaskOneLvlStructure(this.openedTaskId).subscribe(value => {
        this.tasks = value.items;
        if (this.tasks && this.tasks.length > 0) {
          this.children = []
          for (let t of this.tasks) {
            if (t.parent?.id == this.openedTaskId) {
              this.children.push(t);
            }

            if (t.child?.id == this.openedTaskId) {
              this.parent = t;
            }
          }
        }

      });
    }

    let screenWidth: number = window.innerWidth;
    this.setDisplayedColumns(screenWidth);
  }

  private setDisplayedColumns(width: number) {
    if (width > 1250) {
      this.displayedColumns = this.allDisplayedColumns;
    } else if (width > 1100) {
      this.displayedColumns = ['number', 'summary', 'relation'];
    } else if (width > 900) {
      this.displayedColumns = ['number', 'summary'];
    } else {
      this.displayedColumns = ['number'];
    }
  }

  getTextColorStyle(type: string | undefined) {
    switch (type) {
      case "Bug":
        return "red";
      case "Feature":
        return "blue";
      case "Task":
        return "black";
      case "Objective":
        return "purple";
      case "Story":
        return "green";
    }
    return "black";
  }

  appendSubTask(taskNumber: string, type: string) {
    this.httpService.appendSubTask(this.openedTaskId, taskNumber, type)
      .subscribe(() => this.ngOnInit());
  }
}
