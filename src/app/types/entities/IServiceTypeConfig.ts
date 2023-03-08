import { IBusinessType } from "./IBusinessType";
import { IServiceType } from "./service-type";

export interface IServiceTypeConfig {
  id: number;
  field: string;
  displayName: string;
  fieldVisible: boolean;
  businessTypeId: number;
  serviceTypeId: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: any;
  businessType?: IBusinessType;
  serviceType?: IServiceType;
}

export interface IServiceTypeConfigMapped {
  key: string,
  data: IServiceTypeConfigMap
}

export interface IServiceTypeConfigMap {
  displayName: string,
  businessTypeId: number,
  services: IServiceTypeMap[]
}

export interface IServiceTypeMap {
  id: number;
  name: string;
  fieldVisible: boolean;
  entryId: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string
}
