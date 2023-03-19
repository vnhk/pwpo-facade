import {Component, OnInit} from '@angular/core';
import {Person} from "../../main/api-models";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  roles = ["ROLE_ADMIN", "ROLE_USER", "ROLE_MANAGER"];
  displayedColumns= ["nick", "email"];
  notActivatedUsers: Person[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.notActivatedUsers.push({email:"test@test.pl", nick:"testNick"})
  }

}
