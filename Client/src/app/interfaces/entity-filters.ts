export class EntityFilters {
  constructor(init?: Partial<EntityFilters>) {
    Object.assign(this, init);
  }

  public tagType: string = '';
  public search: string = '';
  public page: number = 1;
  public pageSize: number = 10;
}
