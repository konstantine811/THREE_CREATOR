import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RequestDataService {
  constructor(private http: HttpClient) {}

  getChartData(): Observable<any> {
    return this.http.get(
      'https://raw.githubusercontent.com/deathbearbrown/learning-three-js-blogpost/master/js/2005-2015.json'
    );
  }
}
