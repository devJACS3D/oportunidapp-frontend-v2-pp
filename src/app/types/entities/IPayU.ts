import { Subject } from "rxjs";
import { ICompany } from "./company";
import { IVacancy } from "./vacancy";

export interface IPayU {
    id: number;
    vacancyId?: number;
    orderId: number;
    transactionId: string;
    state: string;
    paymentNetworkResponseCode: null;
    paymentNetworkResponseErrorMessage: null;
    trazabilityCode: null;
    authorizationCode: null;
    pendingReason: null;
    responseCode: string;
    errorCode: null;
    responseMessage: null;
    additionalInfo: null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: null;
    value: string;
    referenceCode: null;
    attached: null | string;
    vacancy?: IVacancy;
    companyPackageId?: number;
    companyPackage?: CompanyPackage;
    attachedFile?: File;
}

export interface CompanyPackage {
    id: number;
    _label: string;
    company: ICompany;
}
