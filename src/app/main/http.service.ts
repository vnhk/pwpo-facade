import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SortDirection} from "@angular/material/sort";
import {Observable} from "rxjs";
import {Item, ItemApi} from "./list/list.component";

@Injectable({
  providedIn: 'root'
})
export abstract class HttpService {

  protected constructor(protected readonly http: HttpClient) {
  }

  abstract getItems(sort: string, order: SortDirection, page: number): Observable<ItemApi>;

  abstract getByIdPrimaryAttr(id: string | null): Observable<Item>;

  abstract getByIdSecondaryAttr(id: string | null): Observable<Item>;

  toHttpParams(sort: string, order: SortDirection, page: number): object {
    return {};
  }
}
