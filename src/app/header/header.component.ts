import { Component, OnInit } from '@angular/core';
import { LoginService } from '../security/login/login.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showHeaderk: boolean;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.showHeader.subscribe(
      mostrar => this.showHeaderk = mostrar,
    );
  }

}
