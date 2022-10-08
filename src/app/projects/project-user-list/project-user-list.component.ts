import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpService} from "../../main/service/http.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-project-user-list',
  templateUrl: './project-user-list.component.html',
  styleUrls: ['../../main/list/list.component.css']
})
export class ProjectUserListComponent implements AfterViewInit {
  displayedColumns: string[] = ['fullName', 'nickname', 'projectRole'];

  data: Object[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  id: string | null | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public constructor(private httpService: HttpService,
                     private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log(this.sort, this.sort.active, this.sort.direction, this.paginator, this.paginator.pageIndex);
          return this.httpService.getUsersWithAccessToTheProject(this.id,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.allFound;
          return data.items;
        }),
      )
      .subscribe(data => (this.data = data));
  };
}

