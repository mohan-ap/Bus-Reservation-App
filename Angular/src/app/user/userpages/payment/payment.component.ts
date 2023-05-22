import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { render } from 'creditcardpayments/creditCardPayments';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  data: any;
  tickets: any;
  totalPrice!: string; // Variable to store the total price

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: { [x: string]: any }) => {
      console.log(params);
      this.data = params;
      this.totalPrice = this.data.totalPrice; // Assign the total price to the variable
      console.log(this.totalPrice);
    });

    const ticketStr = this.route.snapshot.queryParamMap.get('tickets');
    if (ticketStr) {
      this.tickets = JSON.parse(ticketStr);
      console.log(this.tickets);
    }

    render({
      id: '#mypaypalButtons',
      currency: 'INR',
      value: this.totalPrice,
      onApprove: (details) => {
        alert('Transaction successful');
        console.log(this.tickets);


        setTimeout(() => {
          this.http.post<BusSearchResponse>('http://localhost:8080/book', { tickets: this.tickets }).subscribe(
            (response) => {
              console.log(response);
              if (response && response.hasOwnProperty('message') && response.message === "Tickets booked successfully!") {
                this.router.navigate(['/'])
              } 
            },
            (error) => {
              console.log('Error', error);
            }
          );
        }, 0);
      }
    });
  }
}
interface BusSearchResponse {
  message?: string;
}


// email: sb-yivw925964515@personal.example.com
// password: SJub))7A



// email: sb-e42r025964813@personal.example.com
// password: 3n(EG"_B

