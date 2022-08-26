import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';


@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export abstract class ListComponent implements AfterViewInit {
  exampleDatabase: HttpDatabase | null | undefined;
  data: Object[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  protected httpClient: HttpClient;

  protected constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  ngAfterViewInit() {
    this.exampleDatabase = this.getDB(this.httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          console.log(data);
          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.totalCount;
          return data.items;
        }),
      )
      .subscribe(data => (this.data = data));
  };

  abstract getDB(_httpClient: HttpClient): HttpDatabase;
}

export abstract class HttpDatabase {
  protected constructor(protected _httpClient: HttpClient) {
  }

  abstract getList(sort: string, order: SortDirection, page: number): Observable<ItemApi>;
}

export interface ItemApi {
  items: Item[];
  totalCount: number;
}

export interface Item {
  id: number;
}


