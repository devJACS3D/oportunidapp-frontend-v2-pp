
export interface IFpoItem {
    id:         number;
    content:    string;
    isPositive: boolean;
    facetId:    number;
    createdAt:  string;
    updatedAt:  string;
    facet:      IFacet;
}

export interface IFactor {
    id: number;
    name: string;
    isMultiFacet: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: null;
    facets: IFacet[];
}

export interface IFacet {
    id?: number;
    name: string;
    factor?:IFactor
}
