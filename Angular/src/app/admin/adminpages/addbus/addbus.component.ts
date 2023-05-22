import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-addbus',
  templateUrl: './addbus.component.html',
  styleUrls: ['./addbus.component.css']
})
export class AddbusComponent {
  successMessage!: string;
  errorMessage!: string;
  constructor(private http: HttpClient,private router: Router) {}

  addBusForm=new FormGroup({
    busName:new FormControl("",[Validators.required]),
    numberOfSeats:new FormControl("",[Validators.required]),
    source:new FormControl("",[Validators.required]),
    destination:new FormControl("",[Validators.required]),
    price:new FormControl("",[Validators.required]),
    boardingTime:new FormControl("",[Validators.required]),
    droppingTime:new FormControl("",[Validators.required]),

})


add(addBusForm:any){
      this.http.post<BusSearchResponse>('http://localhost:8080/add-bus',addBusForm.value).subscribe((response) => {
        console.log(response)
        if (response && response.hasOwnProperty('message') && response.message === "Bus Created Sucessfully") {
          this.successMessage = "Bus Created successfully";
          setTimeout(() => {
            this.router.navigate(['/adminpage/buses']);
          }, 2000);
        }
      }, (error) => {
        console.log("Error", error)
        this.errorMessage = "An error occurred while creating the bus.";
      })
}


getMinDate(): string {
  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Add 24 hours (1 day) to the current date
  return oneDayFromNow.toISOString().slice(0, 16);
}

getMaxDate(): string {
  const now = new Date();
  const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
  return oneMonthFromNow.toISOString().slice(0, 16);
}

}
interface BusSearchResponse {
  message?: string;
}

