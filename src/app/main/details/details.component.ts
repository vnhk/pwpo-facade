import {AfterViewInit, Component, Input} from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements AfterViewInit {
  @Input()
  isHistoryDetails = true;
  @Input()
  uploadFileAccessGranted = false;
  @Input()
  downloadFileAccessGranted = false;
  @Input()
  removeFileAccessGranted = false;

  constructor() {

  }

  ngAfterViewInit(): void {

  }
}
