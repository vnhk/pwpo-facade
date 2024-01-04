import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, BaseRouteReuseStrategy} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RouterStrategyService extends BaseRouteReuseStrategy {

  constructor() {
    super();
  }

  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}
