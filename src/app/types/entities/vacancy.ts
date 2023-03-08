import { ICity } from "./city";
import { ICompany } from "./company";
import { IContractType } from "./contract-type";
import { IDrivingLicense } from "./driving-license";
import { ISector } from "./sector";
import { IServiceType } from "./service-type";
import { IState } from "./state";
import { IVacancyRequirement } from "./vacancyRequirement";
import { IWorkday } from "./workday";

export interface IVacancy {
  idVacEval: any;
  id: number;
  name: string;
  sectorId: number;
  description: string;
  country: string;
  stateId: number;
  cityId: number;
  workdayId: number;
  serviceTypeId: number;
  preinterviewId: number;
  contractTypeId: number;
  maxSalary: number;
  minSalary: number;
  contractDate: any;
  amountVacantion: number;
  yearsExperience: string;
  minimunAge: number;
  maximunAge: number;
  educationalLevelId: number;
  availabilityToTravel: string;
  additionalsServices: any[];
  languages: string[];
  curriculumsSeens: any[];
  drivingLicenseId: number;
  availabilityToRelocation: string;
  peopleDiscapacity: string;
  images: string;
  confidentialCompany: boolean;
  companyId: number;
  country_id: number;
  tests: any[];
  credentialsId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  facebook: boolean;
  twitter: boolean;
  linkedin: boolean;

  vacancyRequirement: IVacancyRequirement;

  city: ICity;
  state: IState;
  sector: ISector;
  contractType: IContractType;
  workday: IWorkday;
  drivingLicense: IDrivingLicense;
  serviceType: IServiceType;

  published: boolean;

  priceVacancy: number;
  company: ICompany;
}
