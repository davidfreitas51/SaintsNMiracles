export enum TagType {
  Saint = 0,
  Miracle = 1,
}

export class EntityFilters {
  public search: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public type?: TagType; 
}
