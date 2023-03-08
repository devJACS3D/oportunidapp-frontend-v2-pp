import { IState } from "./state";

export interface ICity {
  id?: number;
  name: string;
  stateId: number;
  state: IState
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
