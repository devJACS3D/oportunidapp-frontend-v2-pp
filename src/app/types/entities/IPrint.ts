import { IUser } from "./IUser";

export interface IPrintPsychoTest {
    test: {
        name: string,
        createdAt: string,
        data: IPrintPsychoData[]
    },
    user: IUser
}

export interface IPrintPersonalityTest {
    facets: any[];
    factors: any[];
    test: any;
}

interface IPrintPsychoData {
    questions: IQuestionXAnswer[],
    behavior: {
        name: string,
        feedback: string,
        percentage: string | number,
        percentageText: string,
        trainingPlan: string
    }
}

interface IQuestionXAnswer {
    question: string;
    answer: string;
}