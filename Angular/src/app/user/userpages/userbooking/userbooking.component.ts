import { Component } from '@angular/core';
import { Router, ActivatedRoute,NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-userbooking',
  templateUrl: './userbooking.component.html',
  styleUrls: ['./userbooking.component.css']
})
export class UserbookingComponent {
  constructor(private route: ActivatedRoute,private router: Router) { }


  bus:any[]=[]
  journeyDate:any;
  source:any;
  destination:any;
  errorMessage!:string
  

  ngOnInit() {
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      let dataStr = params['data'];
      this.journeyDate = params['journeyDate'];
      this.source=params['source'];
      this.destination=params['destination'];
      console.log(this.journeyDate)
      console.log(this.source)
      console.log(this.destination)
      this.bus = JSON.parse(dataStr);
      console.log(this.bus);
    });
  }



  selectedSeatNumbers: string[] = [];
  count: number = 0;
  totalPrice: number = 0;

  


  onSeatClick(seat: any) {
    if (seat.status && seat.selected) {
      seat.selected = false;
      this.count--;
      this.totalPrice = this.totalPrice-seat.price;
      const index = this.selectedSeatNumbers.indexOf(seat.seatNumber.toString());
      if (index !== -1) {
        this.selectedSeatNumbers.splice(index, 1);
      }
    } else if (seat.status && this.count < 5) {
      seat.selected = true;
      this.count++;
      this.totalPrice = this.totalPrice+seat.price;
      this.selectedSeatNumbers.push(seat.seatNumber.toString());
    }
    else {
      this.errorMessage="You can select up to 5 seats."
      setTimeout(() => {
        this.errorMessage = "";
      }, 2000); 
    }
  }

  book(selectedSeatNumbers:any,totalprice:any,count:any){
    const ticket = this.bus.filter(obj => this.selectedSeatNumbers.includes(obj.seatNumber.toString())).map(obj => ({
      seatId: obj._id,
      status: false,
      busId: obj.bus,
      busName: obj.busName,
      seatNumber: obj.seatNumber,
      price: obj.price,
      journeyDate:this.journeyDate,
      source:this.source,
      destination:this.destination
    }));
    console.log(ticket)
    const queryParams = {
      selectedSeatNumbers,
      count,
      totalprice,
      ticket: JSON.stringify(ticket)
    };
  
    this.router.navigate(['/userpage/userbus'], { queryParams });
  }
 

}
