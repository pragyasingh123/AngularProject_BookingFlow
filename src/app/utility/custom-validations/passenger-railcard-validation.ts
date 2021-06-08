import { ValidatorFn, AbstractControl } from "@angular/forms";
//import { RailCardList, RailCardMasterData } from 'src/app/models/master/railcard-master.model';

 export function railcardPerPassengerValidator(railcardCounts: number, adultCount: number, childCount: number, selectedRailcard: string, currentRailcardCount: number): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
        // if (passengerCount < railcardCounts) {
        //     return { 'railcardPerPassenger': true };
        // }

        switch(selectedRailcard){
            case 'TSU': {
                let minAdult = 1*currentRailcardCount, maxAdult = 1*currentRailcardCount, minChild = 0, maxChild = 0;
                if( adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'YNG': {
                let minAdult = 1*currentRailcardCount, maxAdult = 1*currentRailcardCount, minChild = 0, maxChild = 0;
                if( adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'TST': {
                let minAdult = 1*currentRailcardCount, maxAdult = 1*currentRailcardCount, minChild = 0, maxChild = 0;
                if( adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'NGC': {
                let minAdult = 1*currentRailcardCount, maxAdult = 4*currentRailcardCount, minChild = 0, maxChild =  4*currentRailcardCount;
                if( adultCount < minAdult ){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'DIC': {
                let minAdult = 0, maxAdult = 1*currentRailcardCount, minChild = 1*currentRailcardCount, maxChild = 1*currentRailcardCount;
                if( childCount < minChild){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'DIS': {
                let minAdult = 1*currentRailcardCount, maxAdult = 2*currentRailcardCount, minChild = 0, maxChild = 1*currentRailcardCount;
                if( adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'FAM': {
                let minAdult = 1*currentRailcardCount, maxAdult = 4*currentRailcardCount, minChild = 1*currentRailcardCount, maxChild = 4*currentRailcardCount;
                if( adultCount < minAdult || childCount < minChild){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'HMF': {
                let minAdult = 1*currentRailcardCount, maxAdult = 1*currentRailcardCount, minChild = 0, maxChild = 0;
                if( adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'JCP': {
                let minAdult = 1*currentRailcardCount, maxAdult = 1*currentRailcardCount, minChild = 0, maxChild = 0;
                if(  adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'NEW': {
                let minAdult = 1*currentRailcardCount, maxAdult = 1*currentRailcardCount, minChild = 0, maxChild = 0;
                if(  adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'SRN': {
                let minAdult = 1*currentRailcardCount, maxAdult = 1*currentRailcardCount, minChild = 0, maxChild = 0;
                if(  adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case '2TR': {
                let minAdult = 2*currentRailcardCount, maxAdult = 2*currentRailcardCount, minChild = 0, maxChild = 0;
                if(  adultCount < minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            case 'SRY': {
                let minAdult = 0, maxAdult = 1*currentRailcardCount, minChild = 0, maxChild = 1*currentRailcardCount;
                if(  adultCount <= minAdult){
                return { 'railcardValid': true };
                }
                break;
            }
            default: {
                return null;
            }
        }
        return null;
    };
}

//control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)
