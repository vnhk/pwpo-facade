import {Component, OnInit} from '@angular/core';
import {Person} from "../../main/api-models";
import {HttpService} from "../../main/service/http.service";
import {MatDialog} from "@angular/material/dialog";
import {UserManageOptionModalComponent} from "../user-manage-option-modal/user-manage-option-modal.component";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  roles = ["ROLE_ADMIN", "ROLE_USER", "ROLE_MANAGER"];
  displayedColumns = ["nick", "email", "roles"];
  notActivatedUsers: Person[] = [];
  allUsers: Person[] = [];

  constructor(private http: HttpService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers() {
    this.http.getAllUsersWithRoles().subscribe(value => {
      this.allUsers = value.items;

      this.notActivatedUsers = this.allUsers.filter(v => v.roles?.includes("ROLE_NOT_ACTIVATED"))
    })
  }

  openActionModal(row: Person) {
    let matDialogRef = this.dialog.open(UserManageOptionModalComponent,
      {
        data: row
      });

    matDialogRef.afterClosed().subscribe(value => {
      this.getUsers();
    });
  }
}
