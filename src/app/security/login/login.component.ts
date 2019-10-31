import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService) { }
  txtLogin: string;
  txtPass: string;

  ngOnInit() {
    // this.loginService.logout();
  }

  submitForm(){
    // this.loginService.login().subscribe(response =>{
    //   this.router.navigateByUrl('/dashboard');
    // })

    this.loginService.login();
    this.router.navigateByUrl('/dashboard');
    
  }
}
