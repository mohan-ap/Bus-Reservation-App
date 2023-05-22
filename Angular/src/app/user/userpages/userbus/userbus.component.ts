import { Component } from '@angular/core';
import { Router, ActivatedRoute,NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { SessionService } from '../../../session.service';


@Component({
  selector: 'app-userbus',
  templateUrl: './userbus.component.html',
  styleUrls: ['./userbus.component.css']
})
export class UserbusComponent { 
  passenger!: FormGroup;
  ticket: any[] = [];
  data: any;
  passengerData:any[]=[]
  email:any

  

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private sessionService: SessionService) { 
   
  }
  

  ngOnInit() {
    this.email = this.sessionService.getItem('userData')?.email;
    this.passenger = this.fb.group({
      mobileNumber: ['', Validators.required],
      mail: [this.email || '', Validators.required],
      passengers: this.fb.array([]),
    });

    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      console.log(params);
      this.data=params
    });
    const ticketStr = this.route.snapshot.queryParamMap.get('ticket');
    if (ticketStr) {
      this.ticket = JSON.parse(ticketStr);
      console.log(this.ticket)
  }

  if (this.ticket.length > 0) {
    this.addPassengers(); 
  } 
}

addPassengers() {
  const ticketArray = this.passenger.get('passengers') as FormArray;
  this.ticket.forEach(() => {
    const passengerGroup = this.fb.group({
      passangerName: ['', Validators.required],
      age: ['', Validators.required]
    });
    ticketArray.push(passengerGroup);
  });
}


pay() {
  const mobileNumber = this.passenger.get('mobileNumber')?.value;
  const mail = this.passenger.get('mail')?.value;


  this.passengerData = this.ticket.map((item, index) => ({
    seatNumber: item.seatNumber,
    name: this.passenger.get(`passengers.${index}.passangerName`)?.value,
    age: this.passenger.get(`passengers.${index}.age`)?.value
  }));

  console.log('Passenger Data:', this.passengerData);

  const data={mobileNumber:mobileNumber,userEmail:mail}
  const tickets = this.ticket.map(obj1 => {
    const matchingObj = this.passengerData.find(obj2 => obj2.seatNumber === obj1.seatNumber);
    if (matchingObj) {
      return { ...obj1, ...matchingObj,...data };
    } else {
      return obj1;
    }
  })
  console.log(tickets);
  this.router.navigate(['/userpage/payment'], { queryParams :{tickets: JSON.stringify(tickets),totalPrice:this.data.totalprice}});
}

}



