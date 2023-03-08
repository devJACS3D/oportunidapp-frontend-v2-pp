import { ITestApplyment } from "./test";

export interface PersonalityTestDataScore {
    data: DataScore[];
    test: ITestApplyment
}

export interface DataScore {
    factor: string;
    value:  DataScoreValue;
}

export interface DataScoreValue {
    acronym:        string;
    name:           string;
    score:          string;
    pt:             number;
    pc:             number;
    grade:          Grade;
    text:           string;
    facets?:        DataScoreValue[];
    facetId?:       number;
    factorAcronym?: string;
}

export enum Grade {
    Alto = "Alto",
    Bajo = "Bajo",
    Promedio = "Promedio",
    MuyAlto = "Muy alto",
    MuyBajo = "Muy bajo",
}
