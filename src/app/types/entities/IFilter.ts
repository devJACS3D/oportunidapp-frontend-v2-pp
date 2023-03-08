export interface IFilter {
  map: Object;
  searchQuery: string;
}

export interface IFilterValues {
  searchQuery?: string;
  company?: string;
  seeVHByUser?: any;
  educationalLevelId?: string | number;
  countryId?: string | number;
  stateId?: string | number;
  cityId?: string | number;
  peopleDiscapacity?: boolean;
  availabilityToTravel?: boolean;
  workdayId?: string | number;
  contractTypeId?: string | number;
  yearsExperience?: string | number;
  minAge?: string | number;
  maxAge?: string | number;
  minSalary?: string | number;
  maxSalary?: string | number;
  profilePicture?: boolean;
  availabilityToRelocation?: boolean;
  drivingLicenseId?: string | number;
  contractDate?: Object | string;
  createdAt?: Object | string;
  sectorId?: string | number;
  location?: { latidude: number | string; longitude: number | string };
  availability?: boolean;
  languages?: string;
  userTypeId?: string | number;
  confidentialCompany?: boolean;
  searchUniversity?: string;
  studying?: boolean;
}

export interface IFilterShowOpts {
  availabilityToRelocation: boolean;
  availabilityToTravel: boolean;
  confidentialCompany: boolean;
  educationalLevelId: boolean;
  peopleDiscapacity: boolean;
  searchUniversity: boolean;
  yearsExperience: boolean;
  contractTypeId: boolean;
  searchQuery: boolean;
  seeVHByUser: boolean;
  company: boolean;
  maxLength: boolean;
  countryId: boolean;
  stateId: boolean;
  cityId: boolean;
  workdayId: boolean;
  minAge: boolean;
  maxAge: boolean;
  minSalary: boolean;
  maxSalary: boolean;
  profilePicture: boolean;
  drivingLicenseId: boolean;
  contractDate: boolean;
  createdAt: boolean;
  sectorId: boolean;
  availability: boolean;
  languages: boolean;
  userTypeId: boolean;
  studying: boolean;
  location: boolean;
}
