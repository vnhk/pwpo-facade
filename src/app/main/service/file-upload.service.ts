import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AttachmentsApi} from "../api-models";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = environment.rooturl;

  constructor(private http: HttpClient) {
  }

  upload(file: File, holderId: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/attachments/${holderId}/attachment`,
      formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  getFiles(holderId: string): Observable<AttachmentsApi> {
    return this.http.get<AttachmentsApi>(`${this.baseUrl}/attachments/${holderId}`);
  }

  download(holderId: string, attachmentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/attachments/${holderId}/attachment/${attachmentId}/download`,
      {responseType: 'blob'});
  }

  export(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/ie-entities/export`,
      {responseType: 'blob'});
  }

  remove(holderId: string, attachmentId: number) {
    return this.http.delete(`${this.baseUrl}/attachments/${holderId}/attachment/${attachmentId}`);
  }
}
