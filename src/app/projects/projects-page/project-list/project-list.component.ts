import {AfterViewInit, Component, HostListener, ViewChild} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {MatSort} from "@angular/material/sort";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['../../../main/list/list.component.css']
})
export class ProjectListComponent implements AfterViewInit {
  allDisplayedColumns: string[] = ['shortForm', 'name', 'summary', 'status', "owner"];
  displayedColumns: string[] = this.allDisplayedColumns;

  data: Object[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  MAX_SUMMARY_LENGTH: number = 50;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public constructor(private httpService: HttpService) {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    let width = event.target.innerWidth;
    this.setDisplayedColumns(width);
  }

  private setDisplayedColumns(width: number) {
    if (width > 1400) {
      this.displayedColumns = this.allDisplayedColumns;
    } else if (width > 1250) {
      this.displayedColumns = ['shortForm', 'name', 'summary', 'status', "owner"];
    } else if (width > 1100) {
      this.displayedColumns = ['shortForm', 'name', 'summary', 'status'];
    } else if (width > 900) {
      this.displayedColumns = ['shortForm', 'name', 'summary'];
    } else {
      this.displayedColumns = ['shortForm', 'name'];
    }
  }

  ngAfterViewInit() {
    let screenWidth: number = window.innerWidth;
    this.setDisplayedColumns(screenWidth);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log(this.sort, this.sort.active, this.sort.direction, this.paginator, this.paginator.pageIndex);
          return this.httpService.getProjects(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
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
          this.resultsLength = data.allFound;
          return data.items;
        }),
      )
      .subscribe(data => (this.data = data));
  };
}

