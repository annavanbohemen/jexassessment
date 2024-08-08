import { Component } from '@angular/core';
import { company } from 'src/app/models/company';
import { vacancy } from 'src/app/models/vacancy';
import { CompanyService } from 'src/app/services/company.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent {
  public companyVacancyList: company[] = [];

  constructor(private companyService: CompanyService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompaniesWithVacancies().subscribe((data: any) => {
      console.log('data', data)
      this.companyVacancyList = data.result.filter(
        (company: company) =>
          Array.isArray(company.Vacancies) && company.Vacancies.length > 0
      );
    });
  }

  openVacancyModal() {
    this.modalService.open()
  }
}
