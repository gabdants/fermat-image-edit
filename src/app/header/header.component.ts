import { Component, OnInit } from '@angular/core';
import { LoginService } from '../security/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showHeaderk: boolean;
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.loginService.showHeader.subscribe(
      mostrar => this.showHeaderk = mostrar,
    );
  }
  
  voltaHome(){
    this.router.navigateByUrl('dashboard');
  }
  logout(){
    this.loginService.logout();
    this.router.navigateByUrl('');
  }

}
