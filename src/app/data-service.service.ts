import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  basePath = 'http://localhost:5000/api/v1/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  addmeet(data: any) {
    return this.http.post<[]>(
      this.basePath + 'meetingdata',
      data,
      this.httpOptions
    );
  }

  editmeet(data: any) {
    return this.http.put<[]>(
      this.basePath + 'meetingdata',
      data,
      this.httpOptions
    );
  }

  deletemeet(data: any) {
    return this.http.delete<[]>(this.basePath + 'meetingdata' + '/' + data);
  }

  getmeet(data: any) {
    return this.http.get<[]>(this.basePath + 'meetingdata' + '?date=' + data, {
      headers: { ['Content-Type']: 'application/json' },
    });
  }
}
