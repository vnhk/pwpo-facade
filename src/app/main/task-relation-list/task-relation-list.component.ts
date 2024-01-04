import {Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TaskStructureItem} from "../api-models";

@Component({
  selector: 'app-task-relation-list',
  templateUrl: './task-relation-list.component.html',
  styleUrls: ['./task-relation-list.component.css']
})
export class TaskRelationListComponent implements OnInit, OnChanges {

  @Input()
  tasks: TaskStructureItem[] = [];
  children: TaskStructureItem[] = [];
  parent: TaskStructureItem | undefined;
  @Input()
  listName: string = "";
  @Input()
  openedTaskId: string | null | undefined = '';

  allDisplayedColumns: string[] = ['number', 'summary', 'relation'];
  displayedColumns: string[] = this.allDisplayedColumns;

  MAX_SUMMARY_LENGTH: number = 50;

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    let width = event.target.innerWidth;
    this.setDisplayedColumns(width);
  }

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
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
}
