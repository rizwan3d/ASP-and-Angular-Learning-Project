import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../Services/BaseService';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  public  isUserLoggedIn = false;

  constructor(http: HttpClient,private router: Router) { super(http) }

  Login(email: string, password: string): boolean {
    this.saveLocalStorage({});
    this.Get(`Login/GetLogin.aspx`).subscribe( (data) => {
      this.saveLocalStorage(data);
      this.router.navigate(["product"])
      return true;
    });
    return true;
  }

  saveLocalStorage(data :any){
    this.isUserLoggedIn = true;
    localStorage.setItem('isUserLoggedIn', JSON.stringify(data)); 
  }

  logout(): void {
    this.isUserLoggedIn = false;
       localStorage.removeItem('isUserLoggedIn'); 
    }
}
