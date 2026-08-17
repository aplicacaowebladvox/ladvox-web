import { AbstractControl } from '@angular/forms'

const cpfValidator = function (control: AbstractControl) {
   const regex = /\d{3}\.?\d{3}\.?\d{3}\-?\d{2}/
   const value = control.value
   if (value && value !== '') {
      return regex.test(value) && isValid(value) ? null : { cpf: true }
   }
   return null
}

export const isValid = function (value: string) {
   value = value.replace(/[^\d]+/g, '')
   let numbers, sum, result
   const digits = value.substring(9)
   let equalDigits = 1

   if (value.length < 11) {
      return false
   }

   for (let i = 0; i < value.length - 1; i++) {
      if (value.charAt(i) !== value.charAt(i + 1)) {
         equalDigits = 0
         break
      }
   }

   if (!equalDigits) {
      numbers = value.substring(0, 9)
      sum = 0
      for (let i = 10; i > 1; i--) {
         sum += (<any>numbers).charAt(10 - i) * i
      }
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
      if (result !== Number(digits.charAt(0))) {
         return false
      }

      numbers = value.substring(0, 10)
      sum = 0
      for (let i = 11; i > 1; i--) {
         sum += (<any>numbers).charAt(11 - i) * i
      }
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
      if (result !== Number(digits.charAt(1))) {
         return false
      }

      return true
   }
   return false
}

export default cpfValidator
