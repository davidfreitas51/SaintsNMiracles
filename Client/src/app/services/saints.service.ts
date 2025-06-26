import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Saint } from '../interfaces/saint';
import { map, Observable, switchMap } from 'rxjs';
import { NewSaintDTO } from '../interfaces/new-saint-dto';
import { SaintWithMarkdown } from '../interfaces/saint-with-markdown';

@Injectable({
  providedIn: 'root',
})
export class SaintsService {
  private http = inject(HttpClient);
  public baseUrl = environment.apiUrl;

  public getSaints(): Observable<Saint[]> {
    return this.http.get<Saint[]>(this.baseUrl + 'saints');
  }

  public getSaint(slug: string): Observable<Saint> {
    return this.http.get<Saint>(this.baseUrl + 'saints/' + slug);
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

  public getSaintWithMarkdown(slug: string): Observable<SaintWithMarkdown> {
    return this.getSaint(slug).pipe(
      switchMap((saint) =>
        this.http
          .get(environment.assetsUrl + saint.markdownPath, {
            responseType: 'text',
          })
          .pipe(
            map((markdown) => ({
              saint,
              markdown,
            }))
          )
      )
    );
  }
}
