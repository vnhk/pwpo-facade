import {AfterViewInit, Component} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../../main/api-models";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['../../../main/details/details.component.css']
})
export class ProjectDetailsComponent implements AfterViewInit {
  primaryAttributes: Project = {};
  secondaryAttributes: Project = {};

  constructor(private httpService: HttpService,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    let id = this.route.snapshot.paramMap.get("id");
    this.httpService.getProjectByIdPrimaryAttr(id).subscribe(value => this.primaryAttributes = value);
    this.httpService.getProjectByIdSecondaryAttr(id).subscribe(value => this.secondaryAttributes = value);
  }
}
