import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { HttpClientModule } from '@angular/common/http';
import { VacancyModalComponent } from './components/vacancy-modal/vacancy-modal.component';
import { ModalService } from './services/modal.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CompaniesComponent,
    VacancyModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [ModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
