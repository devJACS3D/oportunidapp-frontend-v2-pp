import { IBusiness } from "./IBusiness";

export interface IPackage {
    id: number;
    _price: number;
    _label: string;
    _vacancies: number;
    _range: number;
    count: number;
    active: boolean;
    expireAt: string;
    companyId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: any;
    company: IBusiness;
}
