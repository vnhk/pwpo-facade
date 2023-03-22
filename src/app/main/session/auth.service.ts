import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import * as moment from "moment";
import {Router} from "@angular/router";

export interface User {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, password: string) {
    return this.http.post<User>(environment.rooturl + '/auth/login', {username, password})
  }

  public getLoggedUser(): User {
    let item = localStorage.getItem("username");
    return {username: item == null ? "" : item};
  }

  public setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('roles', authResult.roles);
    localStorage.setItem('username', authResult.username);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("roles");
    localStorage.removeItem("username");
    localStorage.removeItem("expires_at");
    this.router.navigateByUrl("/login");
  }

  public isSignedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isSignedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }
    return null;
  }

  isManager() {
    let roles = localStorage.getItem("roles");
    if (roles) {
      return roles.includes("ROLE_MANAGER");
    }

    return false;
  }

  hasNotActivatedAccount() {
    let roles = localStorage.getItem("roles");
    if (roles) {
      return roles.includes("ROLE_NOT_ACTIVATED");
    }

    return false;
  }

  isAdmin() {
    let roles = localStorage.getItem("roles");
    if (roles) {
      return roles.includes("ROLE_ADMIN");
    }

    return false;
  }
}
