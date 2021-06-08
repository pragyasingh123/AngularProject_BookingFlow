import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-component/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeliveryMode, DeliveryOption, DeliveryModeRequest, DeliveryModeResponse } from 'src/app/models/delivery-modes/delivery-modes';
import { AngularMaterialModule } from './material/material-module';
import { httpInterceptorProviders } from './utility/http-interceptors/interceptors-provider';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './Component/layout/layout.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HeaderComponent,logoutPopup } from './Component/layout/header/header.component';
import { FooterComponent } from './Component/layout/footer/footer.component';
import { MixingDeckComponent } from './Component/mixing-deck/mixing-deck.component';
import { TicketSelectionComponent } from './Component/mixing-deck/ticket-selection/ticket-selection.component';
//import { ModifyQttSearchExpendedComponent } from './Component/modify-qtt-search/modify-qtt-search-expended/modify-qtt-search-expended.component';
import { JourneyDetailComponent } from './Component/mixing-deck/journey-detail/journey-detail.component';
import { SearchResultComponent } from './Component/mixing-deck/search-result/search-result.component';
import { ReturnSearchResultComponent } from './Component/mixing-deck/return-search-result/return-search-result.component';
import { MinuteSecondsPipe } from './Pipeline/ConvertMins.pipe';
import { CentsToPoundPipe } from './Pipeline/ConvertCentsToPound.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FareBreakupComponent } from './fare-breakup/fare-breakup.component';
import { ReviewandbuyComponent } from './Component/reviewandbuy/reviewandbuy.component';
import { TicketSelectionInfoComponent } from './Component/reviewandbuy/ticket-selection-info/ticket-selection-info.component';
import { ModeOfDeliveryComponent, deletePopup } from './Component/reviewandbuy/mode-of-delivery/mode-of-delivery.component';
import { NectarcardComponent } from './Component/reviewandbuy/nectarcard/nectarcard.component';
import { ModeOfDeliveryPopupComponent } from './Component/reviewandbuy/mode-of-delivery/mode-of-delivery-popup/mode-of-delivery-popup.component';
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MyProfileDetailComponent } from './Component/profile-section/my-profile-detail/my-profile-detail.component';
import { HomestationComponent } from './Component/profile-section/homestation/homestation.component';
import { SavedJourneyComponent } from './Component/profile-section/saved-journey/saved-journey.component';
import { AddressSectionComponent } from './Component/profile-section/address-section/address-section.component';
import { ProfileComponent } from './Component/profile/profile.component';
import { CardDetailsComponent } from './Component/paymentsandvouchers/card-details/card-details.component';
import { SmartCardsComponent } from './Component/paymentsandvouchers/smart-cards/smart-cards.component';
import { ContinuousAuthorityComponent } from './Component/paymentsandvouchers/continuous-authority/continuous-authority.component';
import { NectarCardLoyaltyComponent } from './Component/paymentsandvouchers/nectar-card-loyalty/nectar-card-loyalty.component';
import { VouchersComponent } from './Component/paymentsandvouchers/vouchers/vouchers.component';
import { TicketPreferencesComponent } from './Component/preferences/ticket-preferences/ticket-preferences.component';
import { SeatingPreferencesComponent } from './Component/preferences/seating-preferences/seating-preferences.component';
import { DeliveryPreferencesComponent } from './Component/preferences/delivery-preferences/delivery-preferences.component';
import { PreferredSmartcardComponent } from './Component/preferences/preferred-smartcard/preferred-smartcard.component';
import { AddressPreferencesComponent } from './Component/preferences/address-preferences/address-preferences.component';
import { CommunicationPreferencesComponent } from './Component/preferences/communication-preferences/communication-preferences.component';

import { RegistrationComponent } from './Component/registration/registration.component';
import { ModifyQttSearchExpendedComponent } from './Component/mixing-deck/modify-qtt-search-expended/modify-qtt-search-expended.component';
import { MytripMyseasonsComponent } from './Component/mytickets/mytrip-myseasons/mytrip-myseasons.component';
import { TicketDetailsComponent } from './Component/mytickets/ticket-details/ticket-details.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedService } from './Services/shared.service';
import { SetAllservicesService } from './Services/set-allservices.service';
import { ConfirmationComponent } from './Component/confirmation/confirmation.component';
import { SigninComponent } from './Component/signin/signin.component';
import { ForgotpasswordComponent } from './Component/forgotpassword/forgotpassword.component';
import { SessionExpiredComponent } from './Component/session-expired/session-expired.component';
import { DatePipe } from '@angular/common';
import { ResetPasswordComponent,resetInformation } from './Component/reset-password/reset-password.component';
import { AddNewAddressComponent } from './Component/reviewandbuy/mode-of-delivery/add-new-address/add-new-address.component';
import { SortByPopupComponent } from './Component/mixing-deck/search-result/sort-by-popup/sort-by-popup.component';
import { JourneySummaryComponent } from './Component/confirmation/journey-summary/journey-summary.component';
import { NectarCardConfirmationComponent } from './Component/confirmation/nectar-card-confirmation/nectar-card-confirmation.component';
import { PromoComponent } from './Component/confirmation/promo/promo.component';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import { SeasonTicketComponent } from './Component/season-ticket/season-ticket.component';
import { ConfirmationMessageComponent } from './Component/confirmation-message/confirmation-message.component';
import { ForgotpasswordResetComponentComponent } from './Component/forgotpassword/forgotpassword-reset-component/forgotpassword-reset-component.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MixingDeckComponent,
    TicketSelectionComponent,
    ModifyQttSearchExpendedComponent,
    JourneyDetailComponent,
    SearchResultComponent,
    ReturnSearchResultComponent,
    MinuteSecondsPipe,
    CentsToPoundPipe,
    FareBreakupComponent,
    logoutPopup,
    resetInformation,
    ReviewandbuyComponent,
    TicketSelectionInfoComponent,
    ModeOfDeliveryComponent,
    SeasonTicketComponent,
    NectarcardComponent,
    ModeOfDeliveryPopupComponent,
    MyProfileDetailComponent,  
    HomestationComponent,  
    SavedJourneyComponent,  
        AddressSectionComponent,
        ProfileComponent, CardDetailsComponent, SmartCardsComponent, ContinuousAuthorityComponent, NectarCardLoyaltyComponent, VouchersComponent,TicketPreferencesComponent, SeatingPreferencesComponent, DeliveryPreferencesComponent, PreferredSmartcardComponent, AddressPreferencesComponent, CommunicationPreferencesComponent, 
        RegistrationComponent,  
        MytripMyseasonsComponent, TicketDetailsComponent,      
        ConfirmationComponent,
        SigninComponent,
        ForgotpasswordComponent,
        SessionExpiredComponent,
        ResetPasswordComponent,
        AddNewAddressComponent,
        deletePopup,
        SortByPopupComponent,
        JourneySummaryComponent,
        NectarCardConfirmationComponent,
        PromoComponent,
        ConfirmationMessageComponent,
        ForgotpasswordResetComponentComponent
 
  ],
  entryComponents:[ModifyQttSearchExpendedComponent,JourneyDetailComponent,FareBreakupComponent,
      ModeOfDeliveryPopupComponent, logoutPopup,SigninComponent,resetInformation, SessionExpiredComponent, SigninComponent,
      SessionExpiredComponent, AddNewAddressComponent, deletePopup,MixingDeckComponent,
       ConfirmationMessageComponent, SortByPopupComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,NgbModule,
   NgxSpinnerModule,
Ng2SearchPipeModule
    
  ],
    providers: [HttpClientModule, { 
      provide: MatDialogRef,
      useValue: []
       }, 
       httpInterceptorProviders, ModeOfDeliveryPopupComponent,ModifyQttSearchExpendedComponent,SetAllservicesService, SharedService, 
       SearchResultComponent, DatePipe,NgbActiveModal,MixingDeckComponent, ReviewandbuyComponent, NectarcardComponent],
      
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
