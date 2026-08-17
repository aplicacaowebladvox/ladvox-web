
export abstract class BaseCardTableActionConfig {
  iconClass!: string;
  tooltip!: string;
  customClass?: string;

  isVisible(line: any): boolean {
    return true;
  }

  public abstract click(line: any): void;
}
