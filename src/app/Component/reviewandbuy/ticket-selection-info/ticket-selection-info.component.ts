import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-selection-info',
  templateUrl: './ticket-selection-info.component.html',
  styleUrls: ['./ticket-selection-info.component.css']
})
export class TicketSelectionInfoComponent implements OnInit {

  public show2:boolean = false;
  public moreEticket:any ="show more";
  showtickets: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  clickEvent()
  {
    this.showtickets = !this.showtickets;  
  }
  lessmore()
  {
    this.show2 = !this.show2;
    if(this.show2)  
    this.moreEticket = "Show less";
  else
    this.moreEticket = "show more";
}

}
