import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-delivery-preferences',
  templateUrl: './delivery-preferences.component.html',
  styleUrls: ['./delivery-preferences.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DeliveryPreferencesComponent implements OnInit {
  public buttonSeemoreless:any = 'See More <span class="material-icons">expand_more</span>';
  showexpansionContainer: boolean = false;

hideshowexpansion(){
  this.showexpansionContainer=!this.showexpansionContainer;
  if(this.showexpansionContainer)  
      this.buttonSeemoreless = 'See Less <span class="material-icons">expand_less</span>';
    else
      this.buttonSeemoreless = 'See More <span class="material-icons">expand_more</span>';
}

  constructor() { }

  ngOnInit() {
  }

}
