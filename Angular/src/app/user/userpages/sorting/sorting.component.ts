import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { differenceInHours, differenceInMinutes, differenceInSeconds, parseISO } from 'date-fns';


@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.css']
})


export class SortingComponent {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }
  sorting!: string
  errorMessage: any
  data3: any
  data: any
  buses: any
  duration: any
  droppingTimeDate: any
  boardingTimeDate: any
  modifiedBuses: any[] = [];
  params: any
  modifiedBus:any
  total:any
  currentPage:any

  getPageRange(total: number): number[] {
    return Array(this.total).fill(0).map((_, i) => i + 1);
  }

  setCurrentPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    console.log(this.currentPage)
    this.http.get<BusSearchResponse>('http://localhost:8080/search-avail-buses', { params:{sortBy:'',source:this.data3.source,destination:this.data3.destination,boardingTime:this.data3.boardingTime,page:this.currentPage} }).subscribe((response) => {
      if (response && response.hasOwnProperty('message') && response.message === "No buses found for the given route.") {
        this.errorMessage = "No buses found for the given Locations and Date";
      } else {
        this.buses = response.buses;
        this.total=response.totalPages;
        console.log(this.total)
        this.modifiedBuses = this.buses.map((bus: any) => {
          const modifiedBus = {
            boardingTime: new Date(bus.boardingTime).toLocaleString(),
            droppingTime: new Date(bus.droppingTime).toLocaleString(),
          };
          return modifiedBus;
        });
  }
}, (error) => {
  console.log("Error", error)
});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.data3 = params;
      this.sorting = this.data3['sortBy'];
  
      if (this.sorting === "duration" || this.sorting === "price" || this.sorting === "boarding" || this.sorting === "droppingTime" || this.sorting === "numberOfSeats") {
        this.http.get<BusSearchResponse>('http://localhost:8080/search-avail-buses', { params }).subscribe((response) => {
          if (response && response.hasOwnProperty('message') && response.message === "No buses found for the given route.") {
            this.errorMessage = "No buses found for the given Locations and Date";
          } else {
            this.buses = response.buses;
            this.total=response.totalPages;
            console.log(this.total)
            this.modifiedBuses = this.buses.map((bus: any) => {
              const modifiedBus = {
                boardingTime: new Date(bus.boardingTime).toLocaleString(),
                droppingTime: new Date(bus.droppingTime).toLocaleString(),
              };
              return modifiedBus;
            });
  
            switch (this.sorting) {
              case "duration":
                this.modifiedBuses.sort((a: any, b: any) => {
                  return a.duration - b.duration;
                });
                break;
              case "price":
                this.modifiedBuses.sort((a: any, b: any) => {
                  return a.price - b.price;
                });
                break;
              case "boarding":
                this.modifiedBuses.sort((a: any, b: any) => {
                  return new Date(a.boardingTime).getTime() - new Date(b.boardingTime).getTime();
                });
                break;
              case "droppingTime":
                this.modifiedBuses.sort((a: any, b: any) => {
                  return new Date(a.droppingTime).getTime() - new Date(b.droppingTime).getTime();
                });
                break;
              case "numberOfSeats":
                this.modifiedBuses.sort((a: any, b: any) => {
                  return a.numberOfSeats - b.numberOfSeats;
                });
                break;
              default:
                break;
            }
          }
        }, (error) => {
          console.log("Error", error);
        });
      }
    });
  }
  

  book(id: any, boardingTime: any, source: any, destination: any) {
    console.log(`Bus with id ${id} is booked.`);
    this.http.get(`http://localhost:8080/get-seats/${id}`, { params: { busId: id } }).subscribe((response) => {
      console.log(response)
      this.data = response
      this.router.navigate(['/userpage/userbooking'], { queryParams: { data: JSON.stringify(this.data), journeyDate: boardingTime, source: source, destination: destination } });
    }, (error) => {
      console.log("Error", error)
    })

  }
}
interface BusSearchResponse {
  message?: String
  buses?: any
  totalPages?:any
}
