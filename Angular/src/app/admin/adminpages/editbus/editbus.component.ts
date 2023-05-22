import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { differenceInHours, differenceInMinutes, differenceInSeconds, parseISO } from 'date-fns';


@Component({
  selector: 'app-editbus',
  templateUrl: './editbus.component.html',
  styleUrls: ['./editbus.component.css']
})
export class EditbusComponent {

  buses: any
  data: any
  duration: any
  droppingTimeDate: any
  boardingTimeDate: any
  modifiedBuses: any[] = [];
  errorMessage!:string
  errorMessage2!:string
  

  constructor(private router: Router, private http: HttpClient) {


    this.http.get<BusSearchResponse>('http://localhost:8080/buses').subscribe((response) => {
      console.log(response)
      if (response && response.hasOwnProperty('message') && response.message === "No Buses Available") {
        this.errorMessage="No buses Available"
      } else {
        this.buses = response
        console.log(this.buses)
        for (let i = 0; i < this.buses.length; i++) {
          this.droppingTimeDate = parseISO(this.buses[i].droppingTime);
          this.boardingTimeDate = parseISO(this.buses[i].boardingTime);

          console.log(this.droppingTimeDate)
          console.log(this.boardingTimeDate)

          const durationHours = differenceInHours(this.droppingTimeDate, this.boardingTimeDate);
          const durationMinutes = differenceInMinutes(this.droppingTimeDate, this.boardingTimeDate) % 60;
          this.duration = {
            hours: durationHours,
            minutes: durationMinutes,
          };

          this.boardingTimeDate = this.boardingTimeDate.toString().substring(0, this.boardingTimeDate.toString().indexOf('GMT') - 1);
          this.droppingTimeDate = this.droppingTimeDate.toString().substring(0, this.droppingTimeDate.toString().indexOf('GMT') - 1);

          const modifiedBus = {
            boardingTime: this.boardingTimeDate,
            droppingTime: this.droppingTimeDate,
            duration: this.duration
          };

          this.modifiedBuses.push(modifiedBus);
          console.log(this.modifiedBuses)
        }

      }

  }, (error) => {
    console.log("Error", error)
  })

  }
delete(id: any) {
  this.http.delete<BusSearchResponse>(`http://localhost:8080/delete-bus/${id}`).subscribe((response) => {
    console.log(response)
    if (response && response.hasOwnProperty('message') && response.message === "Bus Delete Sucessfully !!!") {
      this.errorMessage2="Bus Delete Sucessfully !!!"
      setTimeout(() => {
        this.errorMessage2 = "";
      }, 2000); 

      this.buses = this.buses.filter((bus: { id: any; }) => bus.id !== id);
    }  
  }, (error) => {
    console.log("Error", error)
  })
}
}

interface BusSearchResponse {
  message?: string;
}

