import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../main/session/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public authService: AuthService) {

  }

  ngOnInit(): void {
  }

}
