import { ValidatorFn, AbstractControl } from "@angular/forms";

export function childValidator( childCount: number, childRemaining: number, selectedRailcard: string, currentRailcardCount: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        // if (passengerCount < railcardCounts) {
        //     return { 'railcardPerPassenger': true };
        // }
        switch (selectedRailcard) {
            case 'TSU': {
                let minChild = 0, maxChild = 0;
                if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                else if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'YNG': {
                let minChild = 0, maxChild = 0;
                if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                else if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'TST': {
                let minChild = 0, maxChild = 0;
                if (childCount > 0) {
                    return { 'railcardValid': true };
                }
                else if (childCount > 0) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'NGC': {
                let  minChild = 0, maxChild = 4 * currentRailcardCount;
                if ( childCount > childRemaining) {
                    return { 'railcardValid': true };
                }
                else if ( childCount < minChild || childCount > maxChild) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'DIC': {
                let  minChild = 1 * currentRailcardCount, maxChild = 1 * currentRailcardCount;
                if ( childCount > childRemaining) {
                    return { 'railcardValid': true };
                }
                else if ( childCount < minChild || childCount > maxChild) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'DIS': {
                let  minChild = 0, maxChild = 1 * currentRailcardCount;
                if ( childCount > childRemaining) {
                    return { 'railcardValid': true };
                }
                else if ( childCount < minChild || childCount > maxChild) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'FAM': {
                let minChild = 1 * currentRailcardCount, maxChild = 4 * currentRailcardCount;
                if (childCount > childRemaining) {
                    return { 'railcardValid': true };
                }
                else if ( childCount < minChild || childCount > maxChild) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'HMF': {
                let  minChild = 0, maxChild = 0;
                if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                else if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'JCP': {
                let  minChild = 0, maxChild = 0;
                if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                else if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'NEW': {
                let  minChild = 0, maxChild = 0;
                if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                else if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'SRN': {
                let  minChild = 0, maxChild = 0;
                if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                else if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case '2TR': {
                let  minChild = 0, maxChild = 0;
                if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                else if ( childCount > 0) {
                    return { 'railcardValid': true };
                }
                break;
            }
            case 'SRY': {
                let  minChild = 0, maxChild = 1 * currentRailcardCount;
                if ( childCount > childRemaining) {
                    return { 'railcardValid': true };
                }
                else if ( childCount < minChild || childCount > maxChild) {
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