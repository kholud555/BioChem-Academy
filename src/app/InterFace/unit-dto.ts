

export interface CreateUnitDTO  {
  title: string;
  description?: string;
  order: number;
  isFree: boolean;
  isPublished: boolean;
  termId: number;
}
    

export interface UnitDTO  extends CreateUnitDTO  {
  id: number;
}
