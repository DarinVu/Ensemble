import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function createLinkValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

       
        if (value.substring(0, 17) != 'https://youtu.be/') {
            return { "invalidLink": true};
          }
 
        return null;

       
    }
}