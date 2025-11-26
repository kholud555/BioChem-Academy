


export interface MediaDTO {
  id?: number;
  mediaType: MediaTypeEnum;
  storageKey: string;
  fileFormat: FileFormatEnum;
  lessonId: number;
  duration?: number | null;
}

export interface MediaAdminDTO {
  id: number;
  fileName: string;
  mediaType: string;
  fileFormat: string;
  duration?: number | null;
  previewUrl: string;
}



export interface PresignRequestDTO {
  grade: string;
  term: string;
  unit: string;
  lessonId: number;
  fileName: string;
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


export interface FreeContentDTO {
  gradeName: string;
  term: string;
  unitName: string;
  lessonName: string;
  mediaOfFreeLesson: StudentAccessedMediaDTO[];
}
