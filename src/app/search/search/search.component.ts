import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from "../../main/service/http.service";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Item, SearchRequest} from "../../main/api-models";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private httpService: HttpService,
              public snackBar: MatSnackBar) {
  }

  @ViewChild('simpleGrouping') simpleGrouping!: any;
  @ViewChild('advancedGrouping') advancedGrouping!: any;

  criteriaAmount = 0;
  groupAmount = 0;
  resultOperator = "";
  queryChecked = [false];
  availableQueriesForGrouping: string[] = [];
  groupValue = "";
  search = new SearchRequest();
  searchPerformed = false;

  projectDisplayedColumns: string[] = ['shortForm', 'name', 'summary', 'owner', 'status'];
  taskDisplayedColumns: string[] = ['type', 'number', 'status', 'assignee', 'dueDate', 'priority'];
  userDisplayedColumns: string[] = ['firstName', 'lastName', 'nick'];
  displayedColumns: string[] = [];

  dataSource: MatTableDataSource<Item> = new MatTableDataSource();


  newSearch() {
    this.dataSource = new MatTableDataSource();
    this.criteriaAmount = 0;
    this.groupAmount = 0;
    this.resultOperator = "";
    this.queryChecked = [false];
    this.availableQueriesForGrouping = [];
    this.groupValue = "";
    this.search = new SearchRequest();
    this.searchPerformed = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
  }

  addCriteria() {
    let id = "C" + ++this.criteriaAmount;
    this.availableQueriesForGrouping.push(id);
    this.search.criteria.push({
      id: id,
      type: "",
      attr: "",
      operator: "",
      value: "",
    })
  }

  saveGroup() {
    let queries = this.groupValue.split(",");
    for (let i = 0; i < queries.length; i++) {
      this.availableQueriesForGrouping = this.availableQueriesForGrouping.filter(e => e !== queries[i]);
    }

    this.groupAmount++;
    let groupId = "G" + this.groupAmount;
    this.availableQueriesForGrouping.push(groupId);

    this.search.groups.push({
      id: groupId,
      queries: queries,
      operator: this.resultOperator
    });
  }

  performSearch() {
    //only one group must exists ex:
    // G2 = G1 OR C4
    // G1 = C1 AND C2 AND C3

    if (!this.searchAvailable()) {
      alert("Invalid query!");
      return;
    }

    if (this.simpleGrouping?.checked) {
      this.search.groups = [];
      this.search.groups.push({
        id: "G1",
        queries: this.availableQueriesForGrouping,
        operator: this.resultOperator
      });
    }

    this.httpService.search(this.search)
      .pipe(
        catchError(this.handleError.bind(this))
      ).subscribe(res => {
      if (this.search.resultType == 'project') {
        this.displayedColumns = this.projectDisplayedColumns;
      }
      if (this.search.resultType == 'task') {
        this.displayedColumns = this.taskDisplayedColumns;
      }
      if (this.search.resultType == 'user') {
        this.displayedColumns = this.userDisplayedColumns;
      }
      this.dataSource = new MatTableDataSource(res.items);
      this.searchPerformed = true;
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.log('An error occurred:', error.error);
      this.showErrorPopup('Search could not be performed!');
    } else {
      console.log(`Backend returned code ${error.status}, body was: `, error.error);
      this.showErrorPopup('Search could not be performed!');
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
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

  searchAvailable() {
    if (this.search.resultType == "" || this.search.resultType == undefined) {
      return false;
    }

    if (this.availableQueriesForGrouping.length == 0) {
      return true;
    }

    if (this.availableQueriesForGrouping.length == 1) {
      return true;
    }

    if (this.simpleGrouping?.checked) {
      if (this.availableQueriesForGrouping.length > 1) {
        return this.resultOperator != null && this.resultOperator != "";
      }
    }

    return false;
  }
}
