import {AfterViewInit, Component} from '@angular/core';
import {ProjectService} from "../../service/project.service";
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

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    let id = this.route.snapshot.paramMap.get("id");
    this.projectService.getByIdPrimaryAttr(id).subscribe(value => this.primaryAttributes = value);
    this.projectService.getByIdSecondaryAttr(id).subscribe(value => this.secondaryAttributes = value);
  }
}
