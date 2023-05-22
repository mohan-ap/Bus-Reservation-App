import { Component, OnInit } from '@angular/core';
// import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleApiService, UserInfo } from '../../../google-api.service';




function sourceDestinationValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const source = control.get('source')?.value;
  const destination = control.get('destination')?.value;

  if (source && destination && source === destination) {
    return { 'sameLocation': true };
  }

  return null;
}
@Component({
  selector: 'app-loghome',
  templateUrl: './loghome.component.html',
  styleUrls: ['./loghome.component.css']
})
export class LoghomeComponent {
  title = 'BusTicketBookingApp';
  user:any;
  loggedIn:any;
  data:any
  errorMessage!:string
  
  options=['coimbatore','chennai','madurai','erode']
  constructor(private http: HttpClient,private router: Router,private readonly googleApi: GoogleApiService) {}

  homeForm = new FormGroup({
    source: new FormControl("", [Validators.required]),
    destination: new FormControl("", [Validators.required]),
    boardingTime: new FormControl("", [Validators.required]),
  }, { validators: sourceDestinationValidator });

  
  // ngOnInit() {
  //   this.authService.authState.subscribe((user) => {
  //     this.user = user;
  //     this.loggedIn = (user != null);
  //     console.log(user)
  //     // this.http.post('http://localhost:3000/person',user.email).subscribe((response) => {
  //     //   console.log(response)
  //     //   // if(response!=null){
  //     //   //   if(response.email=="mohanap2805999@gmail.com"){
  //     //   //     this.router.navigate(['/adminpage']);
  //     //   //   }
  //     //   //   else{
  //     //   //     this.router.navigate(['userpage']);
  //     //   //   }
  //     //   // }
  //     // }, (error) => {
  //     //   console.log("Error", error)
  //     // })

  //         if(user.email=="mohanap2805999@gmail.com"){
  //           this.router.navigate(['/adminpage/addbus']);
  //         }
  //         else{
  //           this.router.navigate(['/userpage']);
  //         }
    
  //   });
  // }
  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn();
  }
  
  login() {
    this.googleApi.login();
  }
  logout() {
    this.googleApi.signOut();
  }
  

  minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  maxDate(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  }


search(homeForm:any){
  console.log(homeForm.value)
  this.http.get<BusSearchResponse>('http://localhost:8080/search-avail-buses',{params:homeForm.value}).subscribe((response) => {
    console.log(response)
    if (response && response.hasOwnProperty('message') && response.message === "No buses found for the given route.") {
      this.errorMessage = "No buses found for the given Locations and Date";
      setTimeout(() => {
        this.errorMessage = "";
      }, 3000); 
    } else {
      this.data=response
      this.router.navigate(['/userpage/userhome'], {   queryParams: {
        data: JSON.stringify(this.data),
        data2: JSON.stringify(homeForm.value)
      } });
    }
  }, (error) => {
    console.log("Error", error)
  })
}

}
interface BusSearchResponse {
  message?: string;
}
