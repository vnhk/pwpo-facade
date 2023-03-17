import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../main/service/http.service";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SearchRequest} from "../../main/api-models";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private httpService: HttpService,
              public snackBar: MatSnackBar) {
  }

  criteriaAmount = 0;
  groupAmount = 0;
  resultOperator = "";
  queryChecked = [false];
  availableQueriesForGrouping = ["C1"];
  groupValue = "";
  search = new SearchRequest();

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

    if (this.availableQueriesForGrouping.length != 1) {
      console.log("To many groups! Cannot perform search!");
      alert("Invalid query!");
      return;
    }

    this.httpService.search(this.search)
      .pipe(
        catchError(this.handleError.bind(this))
      ).subscribe(() => console.log("Search performed without error"));
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
}
