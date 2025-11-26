export interface CreateLessonDTO {
  title: string;
  description?: string;
  order: number;
 subjectId:number,
  unitId: number;
}

export interface LessonDTO extends CreateLessonDTO {
  id: number;
    isFree: boolean;
}
