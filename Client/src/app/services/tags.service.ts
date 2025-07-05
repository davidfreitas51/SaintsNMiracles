import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Tag } from '../interfaces/tag';
import { TagFilters } from '../interfaces/tag-filters';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'tags';

  getTags(
    filters: TagFilters
  ): Observable<{ items: Tag[]; totalCount: number }> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<{ items: Tag[]; totalCount: number }>(this.baseUrl, {
      params,
    });
  }

  getTag(id: number): Observable<Tag> {
    return this.http.get<Tag>(`${this.baseUrl}/${id}`);
  }

  createTag(name: string): Observable<void> {
    return this.http.post<void>(this.baseUrl, {
      name,
      tagType: 0, // default or placeholder value for now
    });
  }

  updateTag(tag: Tag): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${tag.id}`, {
      name: tag.name,
    });
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
