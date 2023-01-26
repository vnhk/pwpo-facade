import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {HttpService} from "../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {

  projectExists: Boolean = false;
  spin: boolean = false;
  message = "";
  showError = false;

  constructor(private location: Location,
              private httpService: HttpService,
              private route: ActivatedRoute) {
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.spin = true;

    let id = this.route.snapshot.paramMap.get("id");
    this.httpService.doesProjectExist(id).subscribe({
      next: v => {
        this.projectExists = v;
        this.complete();
      },
      error: () => {
        this.projectExists = false
        this.complete();
      }
    });
  }

  private complete() {
    this.spin = false;
    if (!this.projectExists) {
      this.error("Project not found!");
    }
  }

  private error(message: string) {
    this.message = message;
    this.spin = false;
    this.showError = true;
  }
}
