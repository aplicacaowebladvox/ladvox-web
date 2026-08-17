import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface RoleGrid {
  id?: number;
  name?: string;
  permissionsSize?: number;
  canRemove: boolean;
}
