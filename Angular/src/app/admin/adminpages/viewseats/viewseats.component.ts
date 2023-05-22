import { Component } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viewseats',
  templateUrl: './viewseats.component.html',
  styleUrls: ['./viewseats.component.css']
})
export class ViewseatsComponent {
  constructor(private route: ActivatedRoute,private dialog: MatDialog,private http:HttpClient) { }


  bus:any[]=[]
  ngOnInit() {
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      let dataStr = params['data'];
      this.bus = JSON.parse(dataStr);
      console.log(this.bus);
    });
  }

  openModal(seat: any) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: seat
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(seat.status)
        console.log(seat._id)
        this.http.put('http://localhost:8080/update-status',{id:seat._id,status:seat.status}).subscribe((response) => {
          console.log(response);
      }, (error) => {
          console.log("Error", error);
        });

      }
    });
  }
}
