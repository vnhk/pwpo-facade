import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../../main/api-models";
import {MessageBarComponent} from "../../../main/message-bar/message-bar.component";
import {AuthService} from "../../../main/session/auth.service";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['../../../main/details/details.component.css']
})
export class ProjectDetailsComponent implements AfterViewInit {
  primaryAttributes: Project = {};
  secondaryAttributes: Project = {};
  spin: boolean = false;
  @ViewChild(MessageBarComponent)
  messageBarComponent: MessageBarComponent | undefined;

  uploadFileAccessGranted = false;
  downloadFileAccessGranted = true;
  removeFileAccessGranted = false;

  constructor(private httpService: HttpService,
              private route: ActivatedRoute,
              public authService: AuthService) {
    if(authService.isManager()) {
      this.removeFileAccessGranted = true;
      this.uploadFileAccessGranted = true;
    }
  }

  ngAfterViewInit() {
    this.spin = true;
    let id = this.route.snapshot.paramMap.get("id");
    this.getAttributes(id);
  }

  private error(message: string) {
    this.spin = false;
    if (this.messageBarComponent) {
      this.messageBarComponent.error(message);
    }
  }

  private getAttributes(id: string | null) {
    let primary = new Promise((resolve, reject) => {
      this.httpService.getProjectByIdPrimaryAttr(id)
        .subscribe({
            next: values => {
              this.primaryAttributes = values.items[0];
              resolve(values);
            },
            error: err => this.error("Could not load project!")
          }
        );
    });

    let secondary = new Promise((resolve, reject) => {
      this.httpService.getProjectByIdSecondaryAttr(id)
        .subscribe({
            next: values => {
              this.secondaryAttributes = values.items[0];
              resolve(values);
            },
            error: err => this.error("Could not load project!")
          }
        );
    });

    Promise.all([primary, secondary]).then((values) => {
      this.spin = false;
    });
  }
}
