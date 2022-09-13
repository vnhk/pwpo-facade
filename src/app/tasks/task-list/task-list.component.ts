import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {SessionService} from "../../main/session/session.service";
import {HttpService} from "../../main/service/http.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['../../main/list/list.component.css']
})
export class TaskListComponent implements AfterViewInit {
  displayedColumns: string[] = ['type', 'number', 'summary', 'status', 'assignee', 'dueDate', 'priority'];

  MAX_SUMMARY_LENGTH: number = 30;

  data: Object[] = [];
  resultsLength = 0;
  isLoadingResults = true;

  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() criteria = 'projectId';


  public constructor(private httpService: HttpService,
                     private route: ActivatedRoute,
                     private session: SessionService) {

  }

  ngAfterViewInit() {
    let projectId = this.route.snapshot.paramMap.get("id");

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.getData(projectId).pipe(catchError(() => observableOf(null)));
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

  private getData(projectId: string | null) {
    if (this.criteria === 'projectId') {
      return this.httpService.getAllTasksByProjectIdPrimaryAttr(projectId,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex
      );
    }

    if (this.criteria === 'assignee') {
      return this.httpService.getAllTasksByAssignee(this.session.getLoggedUser().username,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex
      );
    }

    if (this.criteria === 'owner') {
      return this.httpService.getAllTasksByOwner(this.session.getLoggedUser().username,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex
      );
    }

    throw new Error('Valid criteria');
  }
}
