import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCompaniesWithVacancies(): Observable<any> {
    //return this.http.get(`${this.apiUrl}/companiesWithVacancies`);
    return this.http.get<company>("../../assets/companiesOutput.json");
  }

  getCompanies(): Observable<any> {
    //return this.http.get(`${this.apiUrl}/companies`);
    return this.http.get<company>("../../assets/companiesOutput.json");
  }

  addVacancy(companyId: number, vacancy: { title: string, description: string | null }): Observable<any> {
    return this.http.post(`${this.apiUrl}/vacancies`, { companyId, ...vacancy });
  }
}
