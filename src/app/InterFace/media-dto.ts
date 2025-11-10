export interface MediaDTO {
  id?: number;
  mediaType: string;
  storageKey: string;
  fileFormat: string;
  lessonId: number;
  duration: number;
}
export interface PresignRequestDTO {
  grade: string;
  term: string;
  unit: string;
  lessonId: number;
  fileName: string;
}