export interface ITrainingPlan {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: any;
    trainingPlanSkills: TrainingPlanSkill[];
}

export interface TrainingPlanSkill {
    id: number;
    trainingPlanId: number;
    skillId: number;
    createdAt: string;
    updatedAt: string;
}