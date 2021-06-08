import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'ticket-selection',
  templateUrl: './ticket-selection.component.html',
  styleUrls: ['./ticket-selection.component.css']
})
export class TicketSelectionComponent implements OnInit {
  showtickets: boolean = false;
  cbStandardClass : boolean = false;
  cbFirstClass : boolean = false;
  cbITSOSmartCard : boolean = false;
  FiltersArray  = new Array<any>();
  @Output() 
  appliedFilters = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  clickEvent()
  {
    this.showtickets = !this.showtickets;  
  }
  SetValues(_Selectedval : string)
  {
    if(_Selectedval == "StandardClass")
    { this.cbStandardClass = this.cbStandardClass == true ? false : true; }
    else if(_Selectedval == "FirstClass")
    { this.cbFirstClass =this.cbFirstClass == true ? false : true; }
    else if(_Selectedval == "ITSOSmartCard")
    { this.cbITSOSmartCard = this.cbITSOSmartCard == true ? false : true; }
        
  }
  ApplyFilters()
  {
    this.FiltersArray.push({"StandardClass" :this.cbStandardClass},
    {"FirstClass" :this.cbFirstClass},
    {"ITSOSmartCard" :this.cbITSOSmartCard});
     this.appliedFilters.emit(this.FiltersArray);
    
  }

}
