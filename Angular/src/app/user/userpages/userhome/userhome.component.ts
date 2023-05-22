import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css']
})
export class UserhomeComponent {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }
  obj: any
  buses: any
  data2: any
  journeyDate: any
  duration: any
  droppingTimeDate: any
  boardingTimeDate: any
  modifiedBuses: any[] = [];
  modifiedBus:any
  total:any
  currentPage:any
  errorMessage:any
  getPageRange(total: number): number[] {
    return Array(this.total).fill(0).map((_, i) => i + 1);
  }

  setCurrentPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    console.log(this.currentPage)
    this.http.get<BusSearchResponse>('http://localhost:8080/search-avail-buses', { params:{sortBy:'',source:this.data2.source,destination:this.data2.destination,boardingTime:this.data2.boardingTime,page:this.currentPage} }).subscribe((response) => {
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
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      console.log(params)
      this.obj = JSON.parse(params['data'])
      console.log(this.obj)
      this.total=this.obj['totalPages']
      this.currentPage=this.obj['currentPage']
      console.log(this.total)
      console.log(this.currentPage)
      this.buses = this.obj['buses']
      this.data2 = JSON.parse(params['data2']);
      console.log(this.buses);
      for (let i = 0; i < this.buses.length; i++) {

        this.boardingTimeDate= new Date(this.buses[i].boardingTime).toLocaleString()
        this.droppingTimeDate=new Date(this.buses[i].droppingTime).toLocaleString()

        
        this.modifiedBus = {
          boardingTime: this.boardingTimeDate,
          droppingTime: this.droppingTimeDate,
        };

        this.modifiedBuses.push(this.modifiedBus);
        console.log(this.modifiedBuses)
        console.log(this.buses)
      }

    });
  }
  data: any
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

