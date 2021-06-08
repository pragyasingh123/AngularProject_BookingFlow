import { ValidatorFn, AbstractControl } from "@angular/forms";

export function adultValidator(adultCount: number, adultRemaining: number, selectedRailcard: string, currentRailcardCount: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        // if (passengerCount < railcardCounts) {
        //     return { 'railcardPerPassenger': true };
        // }
        switch (selectedRailcard) {
            case 'TSU': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 1 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'YNG': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 1 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'TST': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 1 * currentRailcardCount ;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'NGC': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 4 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'DIC': {
                let minAdult = 0, maxAdult = 1 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'DIS': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 2 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'FAM': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 4 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'HMF': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 1 * currentRailcardCount;
                if (adultCount > adultRemaining) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'JCP': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 1 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'NEW': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 1 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'SRN': {
                let minAdult = 1 * currentRailcardCount, maxAdult = 1 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case '2TR': {
                let minAdult = 2 * currentRailcardCount, maxAdult = 2 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult ) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'SRY': {
                let minAdult = 0, maxAdult = 1 * currentRailcardCount;
                if (adultCount > adultRemaining ) {
                    return { 'railcardValid': true };
                }
                else if (adultCount < minAdult || adultCount > maxAdult) {
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