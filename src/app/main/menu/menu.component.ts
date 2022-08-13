import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  @ViewChild("menu-toolbar-left-icon")
  leftButton!: ElementRef;

  constructor(private observer: BreakpointObserver) {
  }

  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 800px)'])
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = "over";
          this.sidenav.close();
        } else {
          this.sidenav.mode = "side";
          this.sidenav.open();
        }
      });
  }

  onClickOnLeftToolbarIcon() {
    if (this.sidenav.opened) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
  }

}
