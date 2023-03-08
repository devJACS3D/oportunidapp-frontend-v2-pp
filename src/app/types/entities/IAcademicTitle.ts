
export interface IAcademicTitlesUser {
  id?: number;
  userId?: number;
  startDate?: string;
  finishedDate?: string;
  currentlyStudyingIt?: boolean;
  studiesLevelId?: number;
  studiesLevel?: any;
  institution?: string;
  title?: string;
  isInProcess?: boolean;
  cea?: any;
  startDateCertificate?: string;
  finishDateCertificate?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: any;
  isSinCertificate?: boolean;
  isInTramite?: boolean;
}
