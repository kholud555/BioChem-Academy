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

export interface LessonForMediaDTO {

     id :number,
     fileName :  string ,
     mediaType :  string ,
     fileFormat :  string ,
     duration : number,
     previewUrl :  string 
  
}