import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mytrip-myseasons',
  templateUrl: './mytrip-myseasons.component.html',
  styleUrls: ['./mytrip-myseasons.component.css'],
  encapsulation: ViewEncapsulation.None,
  
})
export class MytripMyseasonsComponent implements OnInit {

  isShow = false;
 
  show() {
    this.isShow = true;
  }
  hide(){
    this.isShow = false;
  }

  constructor() { }

  ngOnInit() {
  }

}
