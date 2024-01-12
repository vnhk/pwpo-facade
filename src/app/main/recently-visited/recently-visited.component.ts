import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecentlyVisitedService} from "./recently-visited.service";
import {RecentlyVisited} from "../api-models";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recently-visited',
  templateUrl: './recently-visited.component.html',
  styleUrl: './recently-visited.component.css'
})
export class RecentlyVisitedComponent implements OnInit, OnDestroy {
  recentlyVisited: RecentlyVisited[] = [];
  private subscription: Subscription;

  constructor(private rVisitedService: RecentlyVisitedService) {
    this.subscription = this.rVisitedService.notifyObservable$.subscribe((data) => {
      this.handleNotification(data);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleNotification(data: any) {
    this.reload();
  }

  ngOnInit(): void {
    this.reload();
  }

  public reload() {
    this.recentlyVisited = this.rVisitedService.loadRecentlyVisited();
  }

}
