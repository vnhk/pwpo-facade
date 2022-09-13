import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpService} from "../../main/service/http.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['../../main/list/list.component.css']
})
export class ProjectListComponent implements AfterViewInit {
  displayedColumns: string[] = ['shortForm', 'name', 'summary', 'status', "owner"];

  data: Object[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  MAX_SUMMARY_LENGTH: number = 30;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public constructor(private httpService: HttpService) {

  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.httpService.getProjects(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new primaryAttributes. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.totalCount;
          return data.items;
        }),
      )
      .subscribe(data => (this.data = data));
  };
}

