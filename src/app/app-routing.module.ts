import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './security/login/login.component';
import { AddImageComponent } from './admin/add-image/add-image.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomImageComponent } from './custom-image/custom-image.component';
import { ToAproveComponent } from './admin/to-aprove/to-aprove.component';
import { AprovadasComponent } from './aprovadas/aprovadas.component';
import { AddFonteComponent } from './admin/add-fonte/add-fonte.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard], },
  // { path: 'home', component: TimelineViewComponent, children: [
  //   {path: '', redirectTo: 'posts', pathMatch: 'full'},
  //   {path: 'posts', component: TimelinePostsComponent, canActivate: [AuthGuard]},
  //   {path: 'posts/:id', component: TimelinePostsComponent, canActivate: [AuthGuard]},
  //   {path: 'post/:id', component: TimelinePostsComponent, canActivate: [AuthGuard]},
  //   {path: 'project/:id', component: TimelineProjectComponent, canActivate: [AuthGuard]}
  // ], canActivate: [AuthGuard] },
  // {path: 'project/ce/:id', component: ProjectAddEditComponent, canActivate: [AuthGuard]},
  // {path: 'project/ce', component: ProjectAddEditComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'editImage/:id', component: CustomImageComponent },  
  { path: 'addImage', component: AddImageComponent },
  { path: 'toApprove', component: ToAproveComponent },
  { path: 'aprovadas', component: AprovadasComponent },
  { path: 'addFonte', component: AddFonteComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
