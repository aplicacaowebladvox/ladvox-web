import { Pipe, PipeTransform } from '@angular/core'

const CPF_LENGTH = 11
const CNPJ_LENGTH = 14

@Pipe({
   name: 'cpfCnpj',
})
export class CpfCnpjPipe implements PipeTransform {
   transform(value: string | null | undefined): string {
      if (value == null) return ''

      if (value.length <= CPF_LENGTH)
         return value
            .padStart(CPF_LENGTH, '0')
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

      if (value.length <= CNPJ_LENGTH)
         return value
            .padStart(CNPJ_LENGTH, '0')
            .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')

      return value
   }
}
