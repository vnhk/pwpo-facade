import {Injectable} from '@angular/core';

export interface User {
  username: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {
  }

  public getLoggedUser(): User {
    return {username: "joedoe", fullName: "Joe Doe"};
  }
}
