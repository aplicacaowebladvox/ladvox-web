import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

export interface MenuItem {
  id: number;
  iconClass: string;
  name: string;
  description: string | null;
  isOpenned: boolean;
  path?: string;
  openInNewTab?: boolean;
  subMenus: MenuItem[];
}
