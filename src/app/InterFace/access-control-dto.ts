export interface AccessControlDTO {
     grantedType: number; // نفس enum الموجود في C#
  studentId: number;
  grantedSectionId: number;
}

export interface StudentPermissionsDTO {
  studentId: number;
  grantedGrade: number[];
  grantedTerms: number[];
  grantedUnits: number[];
  grantedLessons: number[];
  freeLessons: number[];
  gradeNames?: string[];
  termNames?: string[];
  unitNames?: string[];
  lessonNames?: string[];
}