export abstract class BaseAccordionContainerConfig {
  position!: number;
  iconClass!: string;
  tooltip!: string;
  customClass?: string;

  isVisible(line: any): boolean {
    return true;
  }

  public abstract click(line: any): void;
}
