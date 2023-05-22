import { Component } from '@angular/core';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent {
  data:any
  email:any
  name:any
  constructor(private sessionService: SessionService){
    this.data = this.sessionService.getItem('userData');
    this.data = this.sessionService.getItem('userData');
    if (this.data && this.data.email && this.data.name) {
      this.email = this.data.email;
      this.name=this.data.name
    } else {
      this.data = null;
      this.email = null;
      this.name = null;
    }
  }

}
