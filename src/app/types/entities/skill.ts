import { IBehaviour } from "./test";

export interface ISkill {
    id?: number,
    name: string,
    createdAt?: any;
    updatedAt?: any;
    deletedAt?: any;
    questions?: any;
    behaviors?: IBehaviour[]
}