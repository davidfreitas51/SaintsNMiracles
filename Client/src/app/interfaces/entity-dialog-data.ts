import { Observable } from "rxjs";
import { Entity } from "./entity"

export interface EntityDialogData {
  entityName: string;
  getAllFn: (filters: { search: string }) => Observable<{ items: Entity[] }>;
  updateFn: (entity: Entity) => Observable<any>;
  deleteFn: (id: number) => Observable<any>;
  createFn: (name: string) => Observable<any>;
}
