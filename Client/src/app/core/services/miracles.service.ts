import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Miracle } from '../../features/miracles/interfaces/miracle';
import { Observable, switchMap, map } from 'rxjs';
import { NewMiracleDto } from '../../features/miracles/interfaces/new-miracle-dto';
import { MiracleFilters } from '../../features/miracles/interfaces/miracle-filter';
import { MiracleWithMarkdown } from '../../features/miracles/interfaces/miracle-with-markdown';

@Injectable({
  providedIn: 'root',
})
export class MiraclesService {
  private http = inject(HttpClient);
  public baseUrl = environment.apiUrl;

  getMiracles(
    miracleFilters: MiracleFilters
  ): Observable<{ items: Miracle[]; totalCount: number }> {
    let params = new HttpParams();

    Object.entries(miracleFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<{ items: Miracle[]; totalCount: number }>(
      this.baseUrl + 'miracles',
      { params }
    );
  }

  public getMiracle(slug: string): Observable<Miracle> {
    return this.http.get<Miracle>(this.baseUrl + 'miracles/' + slug);
  }

  public getCountries(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'miracles/countries');
  }

  public createMiracle(formValue: any): Observable<void> {
    const miracleDto: NewMiracleDto = {
      title: formValue.title,
      country: formValue.country,
      century: +formValue.century,
      image: formValue.image,
      description: formValue.description,
      markdownContent: formValue.markdownContent,
    };
    return this.http.post<void>(this.baseUrl + 'miracles', miracleDto);
  }

  public deleteMiracle(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'miracles/' + id);
  }

  public updateMiracle(id: string, formValue: NewMiracleDto): Observable<void> {
    return this.http.put<void>(this.baseUrl + 'miracles/' + id, formValue);
  }

  public getMiracleWithMarkdown(slug: string): Observable<MiracleWithMarkdown> {
    return this.getMiracle(slug).pipe(
      switchMap((miracle) =>
        this.http
          .get(environment.assetsUrl + miracle.markdownPath, {
            responseType: 'text',
          })
          .pipe(map((rawMarkdown) => ({ miracle, markdown: rawMarkdown })))
      )
    );
  }
}
