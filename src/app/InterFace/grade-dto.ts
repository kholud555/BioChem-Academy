export interface CreatrGradedTO {
  
   gradeName : string;
   subjectId:number;
}

export interface GradeDTO  extends CreatrGradedTO {
  id: number;
}