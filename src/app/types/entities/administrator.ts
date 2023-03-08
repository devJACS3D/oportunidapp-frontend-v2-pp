import { ICity } from "./city";
import { IIdentificationType } from "./identification-type";
import { IUserType } from "./user-type";

export interface IAdministrator {
    id?: number;
    name: string;
    email: string;
    identification: string;
    company: string;
    serviceType: string;
    
    cityAdministratorId: number; // Enviar como cityId
    identificationTypeId: number;
    sectorId: number;
    userTypeId: number;
    credentialId?: number;

    userType?: IUserType;
    identificationType?: IIdentificationType;
    credential?: ICredential;
    cityAdministrator?: ICity;
    updatedAt?: string;
    createdAt?: string;
    deletedAt?: string;
}


export interface ICredential {
    id?: number;
    username: string;
    email: string;
}
