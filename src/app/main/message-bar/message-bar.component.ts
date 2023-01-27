import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.css']
})
export class MessageBarComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  public error(message: string) {
    this.openBarWithMessage(message, ['error-bar'], 15000);
  }

  private openBarWithMessage(message: string, classes: string[], duration: number) {
    this.snackBar.open(message, "Ok", {
      duration: duration,
      panelClass: classes
    });
  }

}
