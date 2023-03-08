import { IUser } from "./IUser";
import { IVacancyApplyment } from "./IVacancyApplyment";
import { ISector } from "./sector";

export interface ITest {
  id?: number;
  name: string;
  description: string;
  sector?: ISector;
  sectorId?: number;
  questionstest?: any;
}

export interface IBehaviors {
  id?: number;
  name: string;
}
export interface IBehaviour {
  id?: number;
  name: string;
}

export interface ITestApplyment {
  afinidad: number;
  createdAt: string;
  deletedAt?: any;
  done: boolean;
  id: number;
  test: ITest;
  testId: number;
  updatedAt: string;
  user: IUser;
  userId: number;
  vacancyApplication: IVacancyApplyment;
  vacancyApplicationId: number;
  rejectedTestsToVacancyApplication: any;
}
