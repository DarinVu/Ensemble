import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function createDateValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        let today : Date = new Date();

        if (new Date(control.value) < today)
            return { "GreaterThanToday": true };
 
        return null;

       
    }
}