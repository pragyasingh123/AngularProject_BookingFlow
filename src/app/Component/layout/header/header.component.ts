import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { SigninComponent } from 'src/app/Component/signin/signin.component';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  customerName: string;
  basketCount:number;
  isLoggedOut: boolean = false;
  customerkey:string;
  email:string;
  firstname:string;

  constructor(public dialog: MatDialog,private router: Router,public spinnerService: NgxSpinnerService,public sharedService:SharedService) {
    this.sharedService.invokeEvent.subscribe(value => {
      if(value === true){
        this.isLoggedIn = true;
     }
    }); 
   
    if(localStorage.getItem('email') !=null && localStorage.getItem('customerId')!=null){
      this.isLoggedIn = true;
     this.customerName = localStorage.getItem('firstname');
    }
   }
 
   showLogoutPopup() {
    let logoutDialog =  this.dialog.open(logoutPopup,{
      disableClose: false,
      maxWidth: '80vw',
      maxHeight: '90vh',
      width: '600px',
      panelClass:'logoutDialog'
    });
    logoutDialog.afterClosed().subscribe(res => {
      if(res==true){
        this.spinnerService.show();
      }
      this.isLoggedOut = res;
      this.logout();
 });
  }

  openMyAccount(){
    this.router.navigate([`./profile`]);
  }
  logout()
  {
    if(this.isLoggedOut){
      this.removeLocalStorage();
    }

  }

  removeLocalStorage() {
    this.isLoggedIn = false;
    localStorage.removeItem('email');
    localStorage.removeItem('customerId');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
   
    this.spinnerService.hide();
    
  }

  loginPopup()
  {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose=false;
    // dialogConfig.panelClass='sigin-in-popup';
    // dialogConfig.autoFocus=true;
    // dialogConfig.maxHeight='90vw';
    // dialogConfig.maxWidth='80vw';
    // dialogConfig.width='600px';
    // dialogConfig.data={returnUrl:this.router.url};
    // let dialogref= this.dialog.open(SigninComponent,dialogConfig);
   let dialog= this.dialog.open(SigninComponent,{
      disableClose: false,
      maxWidth: '80vw',
      maxHeight: '90vh',
      width: '600px',
      panelClass: 'sigin-in-popup'
    });
    dialog.afterClosed().subscribe(res => {
      if(localStorage.getItem('email') !=null && localStorage.getItem('customerId')!=null){
        this.isLoggedIn = true;
        this.customerName = localStorage.getItem('firstname');
        this.ngOnInit();
       
      }
     });
  }
  ngOnInit() {
    if(this.isLoggedIn){
    
      this.customerName = localStorage.getItem('firstname');
    }
  }
ngOnChanges(){
  let a="v";
}
 
}

@Component({
  selector: 'logout-popup',
  templateUrl: 'logout-popup.html',
})
export class logoutPopup {
  constructor(public dialog: MatDialogRef<logoutPopup>,public spinnerService: NgxSpinnerService,) {}
  isLoggedOut: boolean;
  onLogout(result){
   
    this.isLoggedOut = result;
    if(result){

    }
    this.dialog.close(this.isLoggedOut);

  }

}