import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {AuthService} from "../session/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  @ViewChild("menu-toolbar-left-icon")
  leftButton!: ElementRef;

  constructor(private observer: BreakpointObserver, public authService: AuthService, private router: Router) {
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

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

  logged(): boolean {
    return this.authService.isSignedIn();
  }

}
