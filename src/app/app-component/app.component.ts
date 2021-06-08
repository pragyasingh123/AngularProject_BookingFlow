import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { SharedService } from '../Services/shared.service';

export let browserRefresh = false;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'SWRBookingFLow';
  subscription: Subscription;

  constructor(public SharedService: SharedService,private router: Router){
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
        console.log(browserRefresh);
      }
  });
  //this.SharedService.loaderMessage = "Please wait, we are loading times and fares.";
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
