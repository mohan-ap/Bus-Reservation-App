import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AddbusComponent } from './admin/adminpages/addbus/addbus.component';
import { AdminnavComponent } from './admin/adminnav/adminnav/adminnav.component';
import { EditbusComponent } from './admin/adminpages/editbus/editbus.component';
import { HistoryComponent } from './admin/adminpages/history/history.component';
import { BusesComponent } from './admin/adminpages/buses/buses.component';
import { UsernavComponent } from './user/usernav/usernav/usernav.component';
import { UserhomeComponent } from './user/userpages/userhome/userhome.component';
import { UserbusComponent } from './user/userpages/userbus/userbus.component';
import { UserbookingComponent } from './user/userpages/userbooking/userbooking.component';
import { PaymentComponent } from './user/userpages/payment/payment.component';
import { ViewseatsComponent } from './admin/adminpages/viewseats/viewseats.component';
import { SortingComponent } from './user/userpages/sorting/sorting.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SessionService } from './session.service';
import { LoghomeComponent } from './user/userpages/loghome/loghome.component';
import { UserhistoryComponent } from './user/userpages/userhistory/userhistory.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSelectModule } from 'ngx-select-ex';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './admin/adminpages/modal/modal.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    PagenotfoundComponent,
    HomeComponent,
    AdminnavComponent,
    AddbusComponent,
    EditbusComponent,
    HistoryComponent,
    BusesComponent,
    UsernavComponent,
    UserhomeComponent,
    UserbusComponent,
    UserbookingComponent,
    PaymentComponent,
    ViewseatsComponent,
    SortingComponent,
    LoghomeComponent,
    UserhistoryComponent,
    ModalComponent,

     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot(),
    BrowserAnimationsModule,
    NgxSelectModule,
    MatDialogModule

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    [SessionService], 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
