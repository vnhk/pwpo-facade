import {Component, Input, OnInit} from '@angular/core';
import {FileUploadService} from "../service/file-upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Attachment} from "../api-models";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {

  currentFile?: File;
  progress = 0;
  message = '';

  fileName = 'Select File';
  fileInfos: Attachment[] = [];

  @Input()
  uploadFileAccessGranted = false;
  @Input()
  downloadFileAccessGranted = false;
  @Input()
  removeFileAccessGranted = false;

  constructor(private uploadService: FileUploadService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let holderId = <string>this.route.snapshot.paramMap.get("id");
    this.uploadService.getFiles(holderId).subscribe(
      value => {
        this.fileInfos = value.items;
      }
    );
  }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = 'Select File';
    }
  }

  upload(): void {
    if (!this.uploadFileAccessGranted) {
      return;
    }
    let holderId = <string>this.route.snapshot.paramMap.get("id");
    this.progress = 0;
    this.message = "";

    if (this.currentFile) {
      this.uploadService.upload(this.currentFile, holderId).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.getFilesInfo(holderId);
          }
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }

          this.currentFile = undefined;
        });
    }

  }

  private getFilesInfo(holderId: string) {
    this.uploadService.getFiles(holderId).subscribe(
      value => {
        this.fileInfos = value.items;
      }
    );
  }

  download(attachmentIndex: number) {
    if (!this.downloadFileAccessGranted) {
      return;
    }
    let attachment = this.fileInfos[attachmentIndex];
    let holderId = <string>this.route.snapshot.paramMap.get("id");
    this.uploadService.download(holderId, attachment.id).subscribe(blob => {
      saveAs(blob, attachment.name);
    });
  }

  remove(attachmentIndex: number) {
    if (!this.removeFileAccessGranted) {
      return;
    }

    let attachment = this.fileInfos[attachmentIndex];
    let holderId = <string>this.route.snapshot.paramMap.get("id");
    this.uploadService.remove(holderId, attachment.id).subscribe(value => {
        this.getFilesInfo(holderId)
      }
    );
  }
}
