
export interface ApiResponse{
    code: number;
    message: string;
    response?: any;
    error?: any;
}

export interface ApiResponseRecords<T>{
    data: T[];
    elementsNumber: number;
    pagesNumber: number;
}