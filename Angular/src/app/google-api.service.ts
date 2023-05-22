import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '98854755672-933u8m4m64imi9tvctsks6uv9ovn1l4j.apps.googleusercontent.com',
  scope: 'openid profile email',
};

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
 

  gmail = 'https://gmail.googleapis.com'

  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService, private readonly httpClient: HttpClient,private readonly router: Router) {
    oAuthService.configure(oAuthConfig);
    oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";
 
  }


  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }
  login() {
    this.oAuthService.loadDiscoveryDocument().then( () => {
      this.oAuthService.tryLoginImplicitFlow().then( () => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow()
        } else {
          this.oAuthService.loadUserProfile().then( (userProfile) => {
            console.log(userProfile)
            this.userProfileSubject.next(userProfile as UserInfo)
          })
        }

      })
    });
  }
    
  signOut() {
    this.oAuthService.logOut()
  }

}

