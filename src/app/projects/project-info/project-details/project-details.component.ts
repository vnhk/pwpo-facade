import {AfterViewInit, Component} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {Project} from "../../project-list/project-list.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['../../../main/details/details.component.css']
})
export class ProjectDetailsComponent implements AfterViewInit {
  data: Project = {};

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    let id = this.route.snapshot.paramMap.get("id");
    this.projectService.getById(id).subscribe(value => this.data = value);
  }
}
