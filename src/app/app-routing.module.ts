import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MixingDeckComponent } from './Component/mixing-deck/mixing-deck.component';
import { ReviewandbuyComponent } from './Component/reviewandbuy/reviewandbuy.component';
import { ProfileComponent } from './Component/profile/profile.component';
import { RegistrationComponent } from './Component/registration/registration.component';
import { ConfirmationComponent } from './Component/confirmation/confirmation.component';
import { ForgotpasswordComponent } from './Component/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './Component/reset-password/reset-password.component';
import { SeasonTicketComponent } from './Component/season-ticket/season-ticket.component';
import { ForgotpasswordResetComponentComponent } from './Component/forgotpassword/forgotpassword-reset-component/forgotpassword-reset-component.component';

const routes: Routes = [
    {path:'mixingdeck',component:MixingDeckComponent},
    {path:'reviewbuy',component:ReviewandbuyComponent},
    {path:'profile',component:ProfileComponent},
    {path:'registration',component:RegistrationComponent},
    {path:'confirmation',component:ConfirmationComponent},
    {path:'forgotpassword',component:ForgotpasswordComponent},
    {path:'resetpassword',component:ResetPasswordComponent},
    {path:'seasonticket',component:SeasonTicketComponent},
    {path:'forgotpasswordreset',component:ForgotpasswordResetComponentComponent},
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
