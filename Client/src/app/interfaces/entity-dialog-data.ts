import { Observable } from 'rxjs';
import { Entity } from './entity';
import { PaginatedEntityResponse } from './paginated-entity-response';

export interface EntityDialogData {
  entityName: string;
  getAllFn: (filters: {
    search: string;
    page?: number;
    pageSize?: number;
  }) => Observable<PaginatedEntityResponse>;
  updateFn: (entity: Entity) => Observable<any>;
  deleteFn: (id: number) => Observable<any>;
  createFn: (name: string) => Observable<any>;
}
