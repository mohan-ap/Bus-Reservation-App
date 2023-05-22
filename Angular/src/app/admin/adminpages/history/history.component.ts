import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { parseISO } from 'date-fns';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  data: any;
  journeyTimeDate: any;
  modifiedBuses: any[] = [];
  errorMessage!: string;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<BusSearchResponse>('http://localhost:8080/get-users').subscribe((response) => {
      console.log(response);
      if (response && response.hasOwnProperty('message') && response.message === "No users was found") {
        this.errorMessage = "No history was found";
      } else {
        this.data = response;
        console.log(this.data);
        for (let i = 0; i < this.data.length; i++) {
          this.journeyTimeDate = parseISO(this.data[i].journeyDate);

          console.log(this.journeyTimeDate);

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
