import { IBloodTypes } from "./bloodTypes";
import { ICity } from "./city";
import { IAcademicTitlesUser } from "./IAcademicTitle";
import { IIdentificationType } from "./identification-type";
import { ILaboralExperience } from "./ILaboralExperience";
import { IState } from "./state";
import { IWorkday } from "./workday";

export interface IUser {
  id?: number;
  credentialUserId?: number;
  fullName?: string
  firstName?: string;
  secondName?: string;
  lastName?: string;
  secondLastName?: string;
  telephone?: string;
  cellphone?: string;
  identificationTypeId?: number;
  identification?: string;
  cityId?: number;
  stateId?: number;
  age?: number;
  languages?: string[];
  maritalStatusId?: number;
  image?: any;
  cv?: any;
  birthday?: string;
  address?: string;
  completedProfile?: boolean;
  completePercent?: number;
  userTypeId?: number;
  placeIdentificationState?: number;
  placeIdentificationCity?: ICity;
  placeIdentificationCityId?: number;
  identificationIssueDate?: string;
  militaryCard?: boolean;
  militaryCardNumber?: number;
  bloodTypesId?: number;
  placeResidenceState?: number;
  placeResidenceCity?: ICity;
  placeResidenceCityId?: number;
  district?: string;
  stratum?: number;
  housingType?: string;
  authorizeCompanyData?: boolean;
  height?: number;
  weight?: number;
  dependents?: number;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  minimumSalary?: number;
  maxSalary?: number;
  availabilityTravel?: boolean;
  workdayId?: number;
  longitude?: any;
  latitude?: any;
  distance?: any;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: any;
  maritalGenderId?: number;
  maritalGender?: any;
  availabilityToRelocation?: boolean;
  peopleDiscapacity?: boolean;
  drivingLicenseId?: number;
  identificationType?: IIdentificationType;
  maritalStatus?: MaritalStatus;
  academicTitlesUsers?: IAcademicTitlesUser[];
  city?: ICity;
  state?: IState;
  personalReferences?: any[];
  usersSectors?: any[];
  credentialUser?: CredentialUser;
  workday?: IWorkday;
  bloodTypes?: IBloodTypes;
  laboralExperiences?: ILaboralExperience[];
  isAdminProfile?: boolean;
  isPsychologistProfile?: boolean;
  isBusinessProfile?: boolean;
  isAgentProfile?: boolean;
  last_singin?:string
  email?:string
}


interface CredentialUser {
  id?: number;
  email?: string;
  username?: string;
  password?: string;
  userTypeId?: number;
  last_singin?: string;
  longitude?: any;
  latitude?: any;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: any;
}
interface MaritalStatus {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
}
