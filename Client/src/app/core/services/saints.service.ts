import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Saint } from '../../features/saints/interfaces/saint';
import { Observable, switchMap, map, from, of } from 'rxjs';
import { NewSaintDto as NewSaintDto } from '../../features/saints/interfaces/new-saint-dto';
import { SaintFilters } from '../../features/saints/interfaces/saint-filter';
import { SaintWithMarkdown } from '../../features/saints/interfaces/saint-with-markdown';

@Injectable({
  providedIn: 'root',
})
export class SaintsService {
  private http = inject(HttpClient);
  public baseUrl = environment.apiUrl;

  getSaints(
    saintFilters: SaintFilters
  ): Observable<{ items: Saint[]; totalCount: number }> {
    let params = new HttpParams();

    Object.entries(saintFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<{ items: Saint[]; totalCount: number }>(
      this.baseUrl + 'saints',
      { params }
    );
  }

  public getSaint(slug: string): Observable<Saint> {
    return this.http.get<Saint>(this.baseUrl + 'saints/' + slug);
  }

  public getCountries(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'saints/countries');
  }

  public createSaint(formValue: any): Observable<void> {
    const feastDayIso = formValue.feastDay
      ? this.formatFeastDayToIso(formValue.feastDay)
      : null;


    const saintDto: NewSaintDto = {
      name: formValue.name,
      country: formValue.country,
      century: +formValue.century,
      image: formValue.image,
      description: formValue.description,
      markdownContent: formValue.markdownContent,
      title: formValue.title || null,
      feastDay: feastDayIso,
      patronOf: formValue.patronOf || null,
      religiousOrderId: formValue.religiousOrder || null,
      tagIds: formValue.currentTags || [],
    };
    return this.http.post<void>(this.baseUrl + 'saints', saintDto);
  }

  public deleteSaint(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'saints/' + id);
  }

  public updateSaint(
    id: string,
    formValue: NewSaintDto & { feastDay?: string }
  ): Observable<void> {
    const formattedFeastDay = formValue.feastDay
      ? this.formatFeastDayToIso(formValue.feastDay)
      : null;

    const payload = {
      ...formValue,
      feastDay: formattedFeastDay,
    };

    return this.http.put<void>(`${this.baseUrl}saints/${id}`, payload);
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

  private formatFeastDayToIso(feastDay: string): string | null {
    if (!feastDay || feastDay.length !== 4) return null;

    const day = feastDay.slice(0, 2);
    const month = feastDay.slice(2, 4);

    return `0001-${month}-${day}`;
  }
}
