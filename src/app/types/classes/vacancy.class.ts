import { ICity } from "@apptypes/entities/city";
import { ICompany } from "@apptypes/entities/company";
import { IContractType } from "@apptypes/entities/contract-type";
import { IDrivingLicense } from "@apptypes/entities/driving-license";
import { ISector } from "@apptypes/entities/sector";
import { IState } from "@apptypes/entities/state";
import { IWorkday } from "@apptypes/entities/workday";
import { VacancyRequirement } from "./vacancyRequirement";

export class Vacancy {
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

  vacancyRequirement: VacancyRequirement

  city: ICity;
  state: IState;
  sector: ISector;
  contractType: IContractType;
  workday: IWorkday;
  drivingLicense: IDrivingLicense;


  priceVacancy: number;
  company: ICompany;
  constructor() {
    this.facebook = false;
    this.twitter = false;
    this.linkedin = false;
    this.vacancyRequirement = new VacancyRequirement();
    this.id = null;
    this.name = null;
    this.sectorId = null;
    this.description = null;
    this.country = null;
    this.stateId = null;
    this.cityId = null;
    this.workdayId = null;
    this.serviceTypeId = null;
    this.preinterviewId = null;
    this.contractTypeId = null;
    this.maxSalary = null;
    this.minSalary = null;
    this.contractDate = null;
    this.amountVacantion = null;
    this.yearsExperience = null;
    this.minimunAge = null;
    this.maximunAge = null;
    this.educationalLevelId = null;
    this.availabilityToTravel = null;
    this.additionalsServices = null;
    this.languages = null;
    this.drivingLicenseId = null;
    this.availabilityToRelocation = null;
    this.peopleDiscapacity = null;
    this.images = null;
    this.confidentialCompany = null;
    this.companyId = null;
    this.country_id = null;
    this.tests = null;
    this.credentialsId = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.deletedAt = null;
    this.priceVacancy = null;
    this.company = null;
  }



  setValuesFromApi(apiValue: any) {
    if (!apiValue) return;
    for (const key in apiValue) {
      if (this[key] !== undefined) {
        if (key === 'vacancyRequirement') {
          this.vacancyRequirement.setRequirementsFromApiValues(apiValue[key])
        } else {
          this[key] = apiValue[key];
        }
      }
    }
  }
}
