import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { parseISO } from 'date-fns';
import { SessionService } from '../../../session.service';


@Component({
  selector: 'app-userhistory',
  templateUrl: './userhistory.component.html',
  styleUrls: ['./userhistory.component.css']
})
export class UserhistoryComponent {
  data: any;
  journeyTimeDate: any;
  modifiedBuses: any[] = [];
  errorMessage!: string;
  email:any

  constructor(private router: Router, private http: HttpClient,private sessionService: SessionService) { }

  ngOnInit(): void {
    this.email=  this.sessionService.getItem('userData');
    this.email=this.email.email
    console.log(this.email)
    this.http.get<BusSearchResponse>('http://localhost:8080/user-history/' + this.email).subscribe((response) => {
      console.log(response);
      if (response && response.hasOwnProperty('message') && response.message === "No History") {
        this.errorMessage = "No history was found";
      } else {
        this.data = response;
        console.log(this.data);
        for (let i = 0; i < this.data.length; i++) {
          this.journeyTimeDate = parseISO(this.data[i].journeyDate);

          this.journeyTimeDate = this.journeyTimeDate.toString().substring(0, this.journeyTimeDate.toString().indexOf('GMT') - 1);

          const modifiedBus = {
            journeyDate: this.journeyTimeDate,
          };

          this.modifiedBuses.push(modifiedBus);
          console.log(this.modifiedBuses);
        }
      }
    }, (error) => {
      console.log("Error", error);
    });
  }
}

interface BusSearchResponse {
  message?: string;
}
