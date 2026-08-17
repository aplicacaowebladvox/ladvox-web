
export class ColumnCardTableConfig {
  title!: string;
  field!: string;
  customClass?: string;
  styles?: string[];

  width: number = 33;

  sortable: boolean = true;
  typeOrder: 'asc' | 'desc' | null = null;
  orderPriority: number = 0;

  convert?: (value: any) => string;
  convertByLine?: (line: any) => string;
  convertStyle?: (value: any) => string;
  convertStyleByLine?: (line: any) => string;
}

