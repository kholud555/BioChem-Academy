// ✅ media-dto.ts
export interface MediaDTO {
  id?: number;
  mediaType: MediaTypeEnum;   // Enum مطابق للباك
  storageKey: string;
  fileFormat: FileFormatEnum; // Enum مطابق للباك
  lessonId: number;
  duration?: number | null;
}

export interface PresignRequestDTO {
  subject :string,
  grade: string;
  term: string;
  unit: string;
  lessonId: number;
  fileName: string;
}

export interface LessonForMediaDTO {
  id: number;
  fileName: string;
  mediaType: string;  // backend بيرجع string زي "Video"
  fileFormat: string; // نفس الكلام
  duration?: number | null;
  previewUrl: string;
}

export enum MediaTypeEnum {
  Video = 0,
  Pdf = 1,
  Image = 2,
}

export enum FileFormatEnum {
  Mp4 = 0,
  Pdf = 1,
  Jpg = 2,
  Png = 3,
}
export interface StudentAccessedMediaDTO {
  fileName: string;
  mediaType: string;
  fileFormat: string;
  duration?: number;
  previewUrl: string;
  
}

export interface AdemdMediaDTO {
  id:number;
  fileName: string;
  mediaType: string;
  fileFormat: string;
  duration?: number;
  previewUrl: string;
  
}

export interface FreeContentDTO {
  subjectName:string;
  gradeName: string;
  term: string;
  unitName: string;
  lessonName: string;
  mediaOfFreeLesson: StudentAccessedMediaDTO[];
}