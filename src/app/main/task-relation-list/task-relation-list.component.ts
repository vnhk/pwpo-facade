import {Component, HostListener, Input, OnInit} from '@angular/core';
import {TaskStructureItem} from "../api-models";
import {HttpService} from "../service/http.service";
import {ActivatedRoute} from "@angular/router";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  constructor(private httpService: HttpService, private route: ActivatedRoute, public snackBar: MatSnackBar) {
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
    if (width > 1100) {
      this.displayedColumns = this.allDisplayedColumns;
    } else if (width > 900) {
      this.displayedColumns = ['number', 'summary', 'relation'];
    } else if (width > 700) {
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

  appendSubTask(taskNumber: string, typeOption: string) {
    if (typeOption == 'CURRENT_TASK_IS_PARENT') {
      this.createRelationship(this.taskNumber, taskNumber, 'CHILD_IS_PART_OF');
    } else if (typeOption == 'CURRENT_TASK_IS_CHILD') {
      this.createRelationship(taskNumber, this.taskNumber, 'CHILD_IS_PART_OF');
    } else if (typeOption == 'CURRENT_TASK_IS_SOLVED_BY') {
      this.createRelationship(this.taskNumber, taskNumber, 'CHILD_SOLVES');
    } else if (typeOption == 'CURRENT_TASK_SOLVES') {
      this.createRelationship(taskNumber, this.taskNumber, 'CHILD_SOLVES');
    }
  }

  private createRelationship(parent: string | undefined, child: string | undefined, type: string) {
    this.httpService.appendSubTask(parent, child, type)
      .pipe(
        catchError(this.handleError.bind(this))
      ).subscribe(() => {
      this.openBarWithMessage("Relationship created!", ['success-bar'], 15000);
      this.ngOnInit()
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.status === 400) {
      this.showErrorPopup(error.error[0].message);
    } else {
      this.showErrorPopup("Cannot create relationship. Contact with administrator.");
    }
    return throwError(() => new Error('Cannot create relationship.'));
  }

  private showErrorPopup(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

  shouldBeExpanded() {
    let item = localStorage.getItem("STRUCTURE_LIST_EXPANDED_" + this.taskNumber);
    if (item == null) {
      return true;
    } else {
      return item == 'true';
    }
  }

  changeExpanded($event: boolean) {
    localStorage.setItem("STRUCTURE_LIST_EXPANDED_" + this.taskNumber, String($event));
  }
}
