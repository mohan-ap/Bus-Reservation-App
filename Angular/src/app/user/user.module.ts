import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingComponent } from './userpages/sorting/sorting.component';
import { HomeComponent } from './userpages/home/home.component';
import { LognavComponent } from './usernav/lognav/lognav.component';
import { LoghomeComponent } from './userpages/loghome/loghome.component';
import { UserhistoryComponent } from './userpages/userhistory/userhistory.component';



@NgModule({
  declarations: [
  
    HomeComponent,
       LognavComponent,
       LoghomeComponent,
       UserhistoryComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
