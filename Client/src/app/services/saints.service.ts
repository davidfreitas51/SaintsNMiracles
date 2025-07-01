import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Saint } from '../interfaces/saint';
import { Observable, switchMap, map, from, of } from 'rxjs';
import { NewSaintDTO } from '../interfaces/new-saint-dto';
import { SaintWithMarkdown } from '../interfaces/saint-with-markdown';
import { SaintFilters } from '../interfaces/saint-filter';
import { marked } from 'marked';

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
    const saintDto: NewSaintDTO = {
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

  getSaintWithMarkdown(slug: string): Observable<SaintWithMarkdown> {
    return this.getSaint(slug).pipe(
      switchMap((saint) =>
        this.http
          .get(environment.assetsUrl + saint.markdownPath, {
            responseType: 'text',
          })
          .pipe(
            switchMap((rawMarkdown) => {
              const html = marked.parse(rawMarkdown);
              if (html instanceof Promise) {
                return from(html).pipe(
                  map((resolvedHtml) => ({ saint, markdown: resolvedHtml }))
                );
              } else {
                return of({ saint, markdown: html });
              }
            })
          )
      )
    );
  }
}