import { IAcademicTitlesUser } from "./IAcademicTitle";
import { ILaboralExperience } from "./ILaboralExperience";
import { IUser } from "./IUser";
import { IVacancyApplyment } from "./IVacancyApplyment";

export interface IBusinessAppUser {
  vacancyApplyment: IVacancyApplyment;
  user: IUser;
  academicTitlesUsers: IAcademicTitlesUser[];
  laboralExperiences: ILaboralExperience[];
  additionalData: {
    businessMustPay: boolean;
  };
}
