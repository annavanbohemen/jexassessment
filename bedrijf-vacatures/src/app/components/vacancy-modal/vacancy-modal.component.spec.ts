import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyModalComponent } from './vacancy-modal.component';
import { of } from 'rxjs';
import { company } from 'src/app/models/company';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { ModalService } from 'src/app/services/modal.service';

describe('VacancyModalComponent', () => {
  let component: VacancyModalComponent;
  let fixture: ComponentFixture<VacancyModalComponent>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockModalService: jasmine.SpyObj<ModalService>;

  const mockCompanies: company[] = [
    { companyId: 1, companyName: 'Company A', companyAddress: '', vacancies: [] },
    { companyId: 2, companyName: 'Company B', companyAddress: '', vacancies: [] }
  ];

  beforeEach(async () => {
    mockCompanyService = jasmine.createSpyObj('CompanyService', ['getCompanies', 'addVacancy']);
    mockModalService = jasmine.createSpyObj('ModalService', ['modalState$', 'close']);

    await TestBed.configureTestingModule({
      declarations: [VacancyModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: ModalService, useValue: mockModalService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacancyModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with controls', () => {
    fixture.detectChanges();
    expect(component.vacatureForm.contains('companyName')).toBeTrue();
    expect(component.vacatureForm.contains('name')).toBeTrue();
    expect(component.vacatureForm.contains('description')).toBeTrue();
  });

  it('should load company names on init', () => {
    mockCompanyService.getCompanies.and.returnValue(of({ result: mockCompanies }));
    fixture.detectChanges();
    
    component.loadCompanyNames();
    
    expect(mockCompanyService.getCompanies).toHaveBeenCalled();
    expect(component.companyList).toEqual(mockCompanies);
  });

  it('should update modal state on init', () => {
    const modalStateSubject = of(true);
    mockModalService.modalState$ = modalStateSubject;

    fixture.detectChanges();

    modalStateSubject.subscribe(() => {
      expect(component.showModal).toBeTrue();
    });
  });

  it('should close modal on closeModal', () => {
    component.closeModal();
    expect(mockModalService.close).toHaveBeenCalled();
  });

  it('should save vacature if form is valid', () => {
    mockCompanyService.getCompanies.and.returnValue(of({ result: mockCompanies }));
    fixture.detectChanges();

    component.vacatureForm.controls['companyName'].setValue('Company A');
    component.vacatureForm.controls['name'].setValue('Vacature Title');
    component.vacatureForm.controls['description'].setValue('Vacature Description');

    component.saveVacature();

    const expectedVacature = { title: 'Vacature Title', description: 'Vacature Description' };
    expect(mockCompanyService.addVacancy).toHaveBeenCalledWith(1, expectedVacature);
    expect(mockModalService.close).toHaveBeenCalled();
  });

  it('should throw an error if company is not found on save', () => {
    mockCompanyService.getCompanies.and.returnValue(of({ result: mockCompanies }));
    fixture.detectChanges();

    component.vacatureForm.controls['companyName'].setValue('Unknown Company');
    component.vacatureForm.controls['name'].setValue('Vacature Title');

    expect(() => component.saveVacature()).toThrow(new TypeError('Bedrijf was niet gevonden, neem contact op met uw ...'));
  });
});
