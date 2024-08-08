import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { company } from 'src/app/models/company';
import { CompanyService } from 'src/app/services/company.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-vacancy-modal',
  templateUrl: './vacancy-modal.component.html',
  styleUrls: ['./vacancy-modal.component.scss']
})
export class VacancyModalComponent {
  showModal = false;
  public companyList: company[] = [];

  public vacatureForm = new FormGroup({
    companyName: new FormControl('',Validators.required),
    name: new FormControl('',Validators.required),
    description: new FormControl(''),
  })

  constructor(private modalService: ModalService, private companyService: CompanyService) { }

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      this.showModal = state;
    });
    this.loadCompanyNames();
  }

  loadCompanyNames(): void {
    this.companyService.getCompanies().subscribe((data: any) => {
      this.companyList = data.result
    });
  }

  closeModal() {
    this.modalService.close();
  }

  saveVacature() {
    if(this.vacatureForm.controls.name.value != undefined || this.vacatureForm.controls.name.value != null){
      const companyId = this.getCompanyIdByName(this.vacatureForm.controls.companyName.value);
      if (companyId === undefined || companyId === null) {
        throw new TypeError('Bedrijf was niet gevonden, neem contact op met uw ...');
      }
      this.companyService.addVacancy(companyId, {title: this.vacatureForm.controls.name.value , description:this.vacatureForm.controls.description.value})
      this.closeModal();
    }
      //load new companies when closed
    }

    getCompanyIdByName(companyName: string | null): number | undefined {
      const company = this.companyList.find(c => c.companyName === companyName);
      return company ? company.companyId : undefined;
    }
  }