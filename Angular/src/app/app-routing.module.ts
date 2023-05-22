import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HomeComponent } from './home/home.component';
import { AddbusComponent } from './admin/adminpages/addbus/addbus.component';
import { BusesComponent } from './admin/adminpages/buses/buses.component';
import { EditbusComponent } from './admin/adminpages/editbus/editbus.component';
import { HistoryComponent } from './admin/adminpages/history/history.component';
import { UserbookingComponent } from './user/userpages/userbooking/userbooking.component';
import { UserhomeComponent } from './user/userpages/userhome/userhome.component';
import { UserbusComponent } from './user/userpages/userbus/userbus.component';
import { PaymentComponent } from './user/userpages/payment/payment.component';
import { ViewseatsComponent } from './admin/adminpages/viewseats/viewseats.component';
import { SortingComponent } from './user/userpages/sorting/sorting.component';
import { LoghomeComponent } from './user/userpages/loghome/loghome.component';
import { UserhistoryComponent } from './user/userpages/userhistory/userhistory.component';



const routes: Routes = [
  {
    path:'adminpage', component:AdminComponent,
    children:[
      {
        path:'addbus',component:AddbusComponent
      },
      {
        path:'buses',component:BusesComponent
      },
      {
        path:'editbus',component:EditbusComponent
      },
      {
        path:'histroy',component:HistoryComponent
      },
      {
        path:'viewseats',component:ViewseatsComponent
      },
    ]
  },
  {
    path:'userpage', component:UserComponent,children:[
      {
        path:'userbooking',component:UserbookingComponent
      },
      {
        path:'userhome',component:UserhomeComponent
      },
      {
        path:'userbus',component:UserbusComponent
      },
      {
        path:'payment',component:PaymentComponent
      },
      {
        path:'sorting',component:SortingComponent
      },
      {
        path:'loghome',component:LoghomeComponent
      },
      {
        path:'userhistory',component:UserhistoryComponent
      }
    ]
  },
  {
    path:'', component:HomeComponent
  },
  {
    path:'**',component:PagenotfoundComponent //**--wildcard entry if any link not works then this will execute
  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
