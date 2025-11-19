export interface CreateLessonDTO {
  title: string;
  description?: string;
  order: number;
 
  unitId: number;
}

export interface LessonDTO extends CreateLessonDTO {
  id: number;
}
