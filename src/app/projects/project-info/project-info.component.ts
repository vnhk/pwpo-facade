import {Component} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent {

  constructor(private location: Location) {
  }

  goBack() {
    this.location.back();
  }
}
