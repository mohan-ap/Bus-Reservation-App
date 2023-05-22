import { Component, OnInit } from '@angular/core';
import { GoogleApiService, UserInfo } from './google-api.service';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BusTicketBookingApp';
  userInfo?: UserInfo;
  email: any;
  name:any

  constructor(
    private readonly googleApi: GoogleApiService,
    private readonly router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe((info) => {
      this.userInfo = info;
      this.email = this.userInfo.info.email;
      this.name=this.userInfo.info.name
      console.log(this.userInfo.info.email);
      console.log(this.userInfo.info.name);
      this.saveDataToSession();
      this.getDataFromSession();
      if (this.email === "mohanap2805999@gmail.com") {
        this.router.navigate(['/adminpage/buses']);
      } else {
        this.router.navigate(['/userpage/loghome']);
      }
    });
  }

  saveDataToSession(): void {
    const data = { email: this.email,name:this.name };
    this.sessionService.setItem('userData', data);
  }

  getDataFromSession(): void {
    const data = this.sessionService.getItem('userData');
    console.log(data);
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
}
