import {Component, OnInit} from '@angular/core';
import {Person} from "../../main/api-models";
import {HttpService} from "../../main/service/http.service";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  roles = ["ROLE_ADMIN", "ROLE_USER", "ROLE_MANAGER"];
  displayedColumns = ["nick", "email"];
  notActivatedUsers: Person[] = [];
  allUsers: Person[] = [];

  constructor(private http: HttpService) {
  }

  ngOnInit(): void {
    this.http.getAllUsersWithRoles().subscribe(value => {
      this.allUsers = value.items;
      this.notActivatedUsers = this.allUsers.filter(v => v.roles?.includes("ROLE_NOT_ACTIVATED"))
    })
  }

}
