import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpService} from "../../main/service/http.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../main/session/auth.service";
import {Person} from "../../main/api-models";
import {MatDialog} from "@angular/material/dialog";
import {
  UserProjectManageOptionModalComponent
} from "./user-manage-option-modal/user-project-manage-option-modal.component";

export class PersonModal {
  projectId: string | null | undefined;
  data: Person | null | undefined;
}

@Component({
  selector: 'app-project-user-list',
  templateUrl: './project-user-list.component.html',
  styleUrls: ['../../main/list/list.component.css', 'project-user-list.component.css']
})
export class ProjectUserListComponent implements AfterViewInit {
  displayedColumns: string[] = ['fullName', 'nick', 'projectRole'];

  data: Object[] = [];
  edit = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  id: string | null | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public constructor(private httpService: HttpService,
                     private route: ActivatedRoute,
                     public authService: AuthService,
                     public dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.loadTable();
  };

  showEdit() {
    this.edit = true;
  }

  hideEdit() {
    this.edit = false;
  }

  openActionModal(row: Person) {
    if (this.authService.isManager()) {
      let id = this.route.snapshot.paramMap.get("id");
      let modalData = new PersonModal();
      modalData.projectId = id;
      modalData.data = row;
      let matDialogRef = this.dialog.open(UserProjectManageOptionModalComponent,
        {
          data: modalData,
        });

      matDialogRef.afterClosed().subscribe(() => {
        this.loadTable();
      });
    }
  }

  openActionModalForNotExisting() {
    let id = this.route.snapshot.paramMap.get("id");
    let modalData = new PersonModal();
    modalData.projectId = id;
    modalData.data = {};
    if (this.authService.isManager()) {
      let matDialogRef = this.dialog.open(UserProjectManageOptionModalComponent,
        {
          data: modalData,
        });

      matDialogRef.afterClosed().subscribe(() => {
        this.loadTable();
      });
    }
  }

  private loadTable() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
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
  }
}

