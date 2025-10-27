export interface CreateTermDTO {
 
  gradeId: number;
 termOrder: number;
  isFree: boolean;
  isPublished: boolean;

}

export interface TermDTO extends CreateTermDTO {
  id: number;
}
