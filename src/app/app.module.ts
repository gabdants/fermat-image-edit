import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './security/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AddImageComponent } from './admin/add-image/add-image.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomImageComponent } from './custom-image/custom-image.component';
import { ToAproveComponent } from './admin/to-aprove/to-aprove.component';
import { AprovadasComponent } from './aprovadas/aprovadas.component';
import { AddFonteComponent } from './admin/add-fonte/add-fonte.component';
import { ContinueEditComponent } from './admin/continue-edit/continue-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    AddImageComponent,
    DashboardComponent,
    CustomImageComponent,
    ToAproveComponent,
    AprovadasComponent,
    AddFonteComponent,
    ContinueEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
