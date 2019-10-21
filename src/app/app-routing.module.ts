import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './security/login/login.component';
import { AddImageComponent } from './admin/add-image/add-image.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  
  { path: 'addImage', component: AddImageComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
