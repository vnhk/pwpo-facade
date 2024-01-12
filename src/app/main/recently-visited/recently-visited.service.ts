import {Injectable} from '@angular/core';
import {RecentlyVisited} from "../api-models";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecentlyVisitedService {
  maxRecentlyVisited = 8;
  private key = "recently_visited";

  constructor() {
  }

  private ITEM_SEPARATOR = ";;;";

  private ATTR_SEPARATOR = ":::";

  private notify = new Subject<any>();

  notifyObservable$ = this.notify.asObservable();

  private notifyOther(data: any) {
    if (data) {
      this.notify.next(data);
    }
  }

  public loadRecentlyVisited() {
    let recentlyVisited: RecentlyVisited[] = [];
    let recentlyVisitedString = localStorage.getItem("recently_visited");
    if (recentlyVisitedString && recentlyVisitedString.trim() != "") {
      let items = recentlyVisitedString.split(this.ITEM_SEPARATOR);
      for (let i = 0; i < items.length; i++) {
        let itemAttr = items[i].split(this.ATTR_SEPARATOR);
        recentlyVisited.push(new RecentlyVisited(itemAttr[0], itemAttr[1], itemAttr[2]));
      }
    }
    return recentlyVisited;
  }

  public addRecentlyVisited(item: RecentlyVisited) {
    let recentlyVisited = this.loadRecentlyVisited();
    console.log(recentlyVisited);
    //remove if the same item as passed is already in the list
    recentlyVisited = recentlyVisited.filter(obj => {
      return obj.name !== item.name
    });
    if (recentlyVisited.length >= this.maxRecentlyVisited) {
      let newRecentlyVisited = [];
      let toBeRemoved = recentlyVisited.length - this.maxRecentlyVisited + 1;
      for (let i = 0; i < recentlyVisited.length - toBeRemoved; i++) {
        newRecentlyVisited.push(recentlyVisited[i]);
      }
      newRecentlyVisited = newRecentlyVisited.reverse();
      newRecentlyVisited.push(item);
      recentlyVisited = newRecentlyVisited;
    } else {
      recentlyVisited = recentlyVisited.reverse();
      recentlyVisited.push(item);
    }
    recentlyVisited = recentlyVisited.reverse();
    this.saveToStorage(recentlyVisited);
    this.notifyOther("reload");
  }


  private saveToStorage(recentlyVisited: RecentlyVisited[]) {
    let storageStr = '';
    for (let i = 0; i < recentlyVisited.length; i++) {
      storageStr += recentlyVisited[i].name + ":::" + recentlyVisited[i].link + ":::" + recentlyVisited[i].tooltip;
      if (i < recentlyVisited.length - 1) {
        storageStr += ";;;";
      }
    }
    localStorage.setItem(this.key, storageStr);
  }
}
