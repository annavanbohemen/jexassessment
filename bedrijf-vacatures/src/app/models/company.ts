import { vacancy } from "./vacancy";

export interface company {
    CompanyId: number,
    CompanyName: string,
    CompanyAddress: string,
    Vacancies: vacancy[]
}