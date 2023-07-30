import {Component, OnInit} from '@angular/core';
import {saveAs} from "file-saver";
import {FileUploadService} from "../../main/service/file-upload.service";
import {AuthService} from "../../main/session/auth.service";

@Component({
  selector: 'app-ie-entities',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.css']
})
export class DataManagementComponent implements OnInit {

  constructor(private uploadService: FileUploadService, private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  export() {
    this.uploadService.export().subscribe(blob => {
      saveAs(blob, new Date().toDateString() + ".xlsx");
    });
  }

}
