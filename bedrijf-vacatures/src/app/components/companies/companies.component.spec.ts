import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesComponent } from './companies.component';
import { company } from 'src/app/models/company';
import { of } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { ModalService } from 'src/app/services/modal.service';

describe('CompaniesComponent', () => {
  let component: CompaniesComponent;
  let fixture: ComponentFixture<CompaniesComponent>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockModalService: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    mockCompanyService = jasmine.createSpyObj('CompanyService', ['getCompaniesWithVacancies']);
    mockModalService = jasmine.createSpyObj('ModalService', ['open']);

    await TestBed.configureTestingModule({
      declarations: [CompaniesComponent],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: ModalService, useValue: mockModalService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges(); // trigger initial data binding
    expect(component).toBeTruthy();
  });

  it('should load companies with vacancies on initialization', () => {
    const mockCompanies: company[] = [
      { companyId: 1, companyName: 'Company A', companyAddress: 'address A', vacancies: [{ vacancyId: 1, vacancyTitle: 'Vacancy A1', vacancyDescription: '' }] },
      { companyId: 2, companyName: 'Company B', companyAddress: 'address B', vacancies: [] },
      { companyId: 3, companyName: 'Company C', companyAddress: 'address C', vacancies: [{ vacancyId: 2, vacancyTitle: 'Vacancy C1', vacancyDescription: '' }] }
    ];

    mockCompanyService.getCompaniesWithVacancies.and.returnValue(of({ result: mockCompanies }));

    fixture.detectChanges(); // trigger ngOnInit

    expect(component.companyVacancyList.length).toBe(2); // Only companies with vacancies should be included
    expect(component.companyVacancyList[0].companyName).toBe('Company A');
    expect(component.companyVacancyList[1].companyName).toBe('Company C');
  });

  it('should open the vacancy modal', () => {
    component.openVacancyModal();
    expect(mockModalService.open).toHaveBeenCalled();
  });
});