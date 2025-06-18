import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Saint } from '../interfaces/saint';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaintsService {
  private http = inject(HttpClient);
  public baseUrl = environment.apiUrl;

  public getSaints(): Observable<Saint[]> {
    return this.http.get<Saint[]>(this.baseUrl + 'saints');
  }

  public createSaint(data: any): Observable<void> {
    return this.http.post<void>(this.baseUrl + 'saints', data);
  }
}
