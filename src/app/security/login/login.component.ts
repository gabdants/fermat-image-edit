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

    this.loginService.getLogin(this.txtLogin, this.txtPass).subscribe(response => {
    }, err => {
      if(err.status == 200){
        if(err.error.text == 'admin'){
          localStorage.setItem('admin', 'true');
          this.router.navigateByUrl('/dashboard');
        }else{
          localStorage.setItem('admin', 'false');
          this.router.navigateByUrl('/dashboard');
        }
        localStorage.setItem('user', this.txtLogin);
        
      }else{
        alert('Login ou senha incorretos. Tente novamente');
      }
    });
    
  }
}
