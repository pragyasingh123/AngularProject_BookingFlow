import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-season-ticket',
  templateUrl: './season-ticket.component.html',
  styleUrls: ['./season-ticket.component.css']
})
export class SeasonTicketComponent implements OnInit {
  public isShowtooltip = false;
  public show1:boolean = false;
  public buttonName:any = 'Show Help ?';
  constructor() { }

  ngOnInit() {
  }
  showhelp()
  {
    this.isShowtooltip = !this.isShowtooltip;
    this.show1 = !this.show1;
    if(this.show1)  
      this.buttonName = "Hide Help ?";
    else
      this.buttonName = "Show Help ?";
  }

}
