import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Saint } from '../interfaces/saint';
import { Observable, switchMap, map, from, of } from 'rxjs';
import { NewSaintDto as NewSaintDto } from '../interfaces/new-saint-dto';
import { SaintWithMarkdown } from '../interfaces/saint-with-markdown';
import { SaintFilters } from '../interfaces/saint-filter';

@Injectable({
  providedIn: 'root',
})
export class SaintsService {
  private http = inject(HttpClient);
  public baseUrl = environment.apiUrl;

  public getSaints(saintFilters: SaintFilters): Observable<Saint[]> {
    let params = new HttpParams();

    Object.entries(saintFilters).forEach(([key, value]) => {
      if (value) params = params.set(key, value);
    });

    return this.http.get<Saint[]>(this.baseUrl + 'saints', { params });
  }

  public getSaint(slug: string): Observable<Saint> {
    return this.http.get<Saint>(this.baseUrl + 'saints/' + slug);
  }

  public getCountries(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'saints/countries');
  }

  public createSaint(formValue: any): Observable<void> {
    const saintDto: NewSaintDto = {
      name: formValue.name,
      country: formValue.country,
      century: +formValue.century,
      image: formValue.image,
      description: formValue.description,
      markdownContent: formValue.markdownContent,
    };
    return this.http.post<void>(this.baseUrl + 'saints', saintDto);
  }

  public deleteSaint(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'saints/' + id);
  }

  public updateSaint(id: string, formValue: NewSaintDto): Observable<void> {
    console.log(formValue)
    return this.http.put<void>(this.baseUrl + 'saints/' + id, formValue);
  }

  public getSaintWithMarkdown(slug: string): Observable<SaintWithMarkdown> {
    return this.getSaint(slug).pipe(
      switchMap((saint) =>
        this.http
          .get(environment.assetsUrl + saint.markdownPath, {
            responseType: 'text',
          })
          .pipe(map((rawMarkdown) => ({ saint, markdown: rawMarkdown })))
      )
    );
  }
}