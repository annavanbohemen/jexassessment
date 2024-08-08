import { vacancy } from "./vacancy";

export interface company {
    companyId: number,
    companyName: string,
    companyAddress: string,
    vacancies: vacancy[]
}