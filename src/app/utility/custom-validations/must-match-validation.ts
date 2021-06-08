import { FormGroup } from '@angular/forms';
import { debug } from 'util';

//custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
export function CheckUsername(firstName: string, matchingControlName: string, userEmail:string, userLastName:string, mobileNumber:string) {
    return (formGroup: FormGroup) => {
        const firstNameControl = formGroup.controls[firstName];
        const matchingControl = formGroup.controls[matchingControlName];
        const emailControl = formGroup.controls[userEmail];
        const lastNameControl = formGroup.controls[userLastName];
        const mobileNumberControl = formGroup.controls[mobileNumber];
        //const email = formGroup.controls[email1];

        if (matchingControl.errors && !matchingControl.errors.checkUsername) {
            // return if another validator has already found an error on the matchingControl
            return;
        }if (matchingControl.errors && !matchingControl.errors.checkUserEmail) {
            // return if another validator has already found an error on the matchingControl
            return;
        }if (matchingControl.errors && !matchingControl.errors.checkUserLastName) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // if (mobileNumberControl.errors && !mobileNumberControl.errors.checkZeroPosition) {
        //     // return if another validator has already found an error on the matchingControl
        //     return;
        // }
        

        if(mobileNumberControl.value !="" && mobileNumberControl.value.charAt(0) == "0") 
        {
            mobileNumberControl.setErrors({ checkZeroPosition: false });
        }else
         if(mobileNumberControl.value !="" && mobileNumberControl.value.charAt(0) == "+") 
        {
            mobileNumberControl.setErrors({ checkZeroPosition: false });
        }
        else if(mobileNumberControl.value !="")
         {
            mobileNumberControl.setErrors({ checkZeroPosition: true });
         }


         if(mobileNumberControl.value !="" && mobileNumberControl.value.charAt(0) == "0" && mobileNumberControl.value.charAt(1) == "0")
        {
            mobileNumberControl.setErrors({ checkalternatetwoZeroPosition: true }); 
        }

        if(mobileNumberControl.value !="" && mobileNumberControl.value.length<11)
        {
           mobileNumberControl.setErrors({ checkMinLength: true });
        }
        
        // set error on matchingControl if validation fails
        if (firstNameControl.value!="" && matchingControl.value.toLowerCase().includes(firstNameControl.value.toLowerCase())) {
            matchingControl.setErrors({ checkUsername: true });
            
        }else if(emailControl.value!="" && matchingControl.value.toLowerCase().includes(emailControl.value.toLowerCase())) 
        {
            matchingControl.setErrors({ checkUserEmail: true });
        }else if(lastNameControl.value!="" && matchingControl.value.toLowerCase().includes(lastNameControl.value.toLowerCase())) 
        {
            matchingControl.setErrors({ checkUserLastName: true });
        }
        // else {
        //     matchingControl.setErrors(null);
        // }
    }
}

   