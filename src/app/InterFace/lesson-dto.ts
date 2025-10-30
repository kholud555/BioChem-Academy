export interface CreateLessonDTO {
  title: string;
  description?: string;
  order: number;
  isFree: boolean;
  isPublished: boolean;
  unitId: number;
}

export interface LessonDTO extends CreateLessonDTO {
  id: number;
}
