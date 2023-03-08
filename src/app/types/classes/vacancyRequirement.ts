export class VacancyRequirement {

  requiredCity
  requiredWorkday
  requiredLanguage
  requiredEducation
  requiredYearsOfExperience
  requiredAge
  requiredSalary
  requiredDrivingLicense
  requiredAvailabilityToTravel
  requiredAvailabilityToRelocation
  requiredPeopleDiscapacity

  constructor() {
    this.requiredCity = false;
    this.requiredWorkday = false;
    this.requiredLanguage = false;
    this.requiredEducation = false;
    this.requiredYearsOfExperience = false;
    this.requiredAge = false;
    this.requiredSalary = false;
    this.requiredDrivingLicense = false;
    this.requiredAvailabilityToTravel = false;
    this.requiredAvailabilityToRelocation = false;
    this.requiredPeopleDiscapacity = false;
  }


  setRequirementsFromApiValues(apiValues) {
    this.requiredCity = apiValues.city;
    this.requiredWorkday = apiValues.workday;
    this.requiredLanguage = apiValues.language;
    this.requiredEducation = apiValues.education;
    this.requiredYearsOfExperience = apiValues.yearsOfExperience;
    this.requiredAge = apiValues.age;
    this.requiredSalary = apiValues.salary;
    this.requiredDrivingLicense = apiValues.drivingLicense;
    this.requiredAvailabilityToTravel = apiValues.availabilityToTravel;
    this.requiredAvailabilityToRelocation = apiValues.availabilityToRelocation;
    this.requiredPeopleDiscapacity = apiValues.peopleDiscapacity;
  }
}
