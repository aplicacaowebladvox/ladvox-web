import { AbstractControl } from "@angular/forms";
import { isBlank } from "../utils/string.util";

const passwordValidator = function (control: AbstractControl) {
  const regex =
      /^(?!.*(.)\1\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()_+={}\[\]|\\:;"'<>,.?\/])[a-zA-Z\d`~!@#$%^&*()_+={}\[\]|\\:;"'<>,.?\/]{6,15}$/
   const value = control.value
   if (!isBlank(value)) return regex.test(value) ? null : { password: true }
   return null
}

export default passwordValidator
