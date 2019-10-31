import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import {
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatSelectModule,
  MatOptionModule,
  MatProgressBarModule,
  MatTabsModule,
  MatDatepickerModule,
  MatDividerModule,
  MatListModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatTreeModule
} from '@angular/material';

import { RouterModule } from '@angular/router';
import { AuthInterceptor } from '../security/auth.interceptor';
import { AuthGuardService } from '../security/auth-guard.service';
import { LoginService } from '../security/login/login.service';
//import { UserService } from '../user/user.service';
import { CategoryService } from '../services/category/category-service';
import { ImageService } from '../services/image/image-service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTabsModule,
    MatProgressBarModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTreeModule
  ],
  declarations: [],
  exports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTabsModule,
    MatProgressBarModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTreeModule
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthGuardService,
        LoginService,
        CategoryService,
        ImageService,
        // UserService,
        // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ]
    };
  }
}
