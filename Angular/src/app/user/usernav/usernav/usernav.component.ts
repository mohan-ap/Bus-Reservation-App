import { Component } from '@angular/core';
import { GoogleApiService, UserInfo } from '../../../google-api.service';
import { SessionService } from '../../../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent {
  data: any;
  email:any
  name:any
  
  constructor(
    private readonly googleApi: GoogleApiService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.data = this.sessionService.getItem('userData');
    if (this.data && this.data.email && this.data.name) {
      this.email = this.data.email;
      this.name=this.data.name
    } else {
      this.data = null;
      this.email = null;
      this.name = null;
    }
    console.log(this.data);
  }
  
  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn();
  }
  
  login() {
    this.googleApi.login();
  }
  
  logout() {
    this.googleApi.signOut();
  }
  
  clear() {
    this.sessionService.clearSession();
    this.router.navigate(['']);
  }
}

