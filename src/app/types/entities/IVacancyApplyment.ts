import { IUser } from "./IUser";
import { IVacancyApplymentStatus } from "./IVacancyApplymentStatus";
import { IVacancy } from "./vacancy";

export interface IVacancyApplyment {
  createdAt: string;
  curriculumSeenId: number;
  curriculumSeen: any;
  deletedAt: string;
  id: number;
  interviewerCommentInterview: string;
  interviewerCommentTest: string;
  psychologistCommentInTest: string;
  updatedAt: string;
  user: IUser;
  userId: number;
  userProgress: string;
  vacancy: IVacancy;
  vacancyApplymentStatusId: number;
  vacancyApplymentStatus: IVacancyApplymentStatus;
  vacancyId: number;
  ableToDownloadFiles?: {
    interviewReport?: boolean,
    referenceReport?: boolean,
    psychologicalReport?: boolean
    report?: boolean
    judicialBackgroundReport?: boolean
    preInterviewReport?: boolean
  }
}
