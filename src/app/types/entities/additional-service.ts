export interface IAdditionalService {
    id?: number;
    name: string;
    price: number;
    description: string;
    stateId?: number;
    cityId?: number;
    city?: any;
    createdAt?: any;
    updatedAt?: any;
    deletedAt?: any;
    selected?: boolean; // to know if the service have been selected
}