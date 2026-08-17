import { Component, ContentChildren, Input, OnInit } from '@angular/core';
import { BaseAccordionContainerConfig } from './models/base-accordion-container.config';
import { CommonModule } from '@angular/common';
import * as uuid from 'uuid';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AccordionComponent implements OnInit {
  @Input()
  title!: string;
  @Input()
  isAccordionGroup: boolean = false;
  @Input()
  componentId: string = uuid.v4();

  @Input()
  accordionTitleOptionalBody?: HTMLElement | null;

  @ContentChildren(HTMLElement)
  body?: HTMLElement;

  @Input()
  actions?: Array<BaseAccordionContainerConfig>;
  @Input()
  accordionClassString?: string = '';
  isOppened?: boolean;

  ngOnInit(): void {
    this.actions?.sort((action1, action2) => action1.position - action2.position);

    if (this.accordionTitleOptionalBody)
      document
        .getElementById('accordionTitleOptionalBody')
        ?.insertAdjacentElement('beforeend', this.accordionTitleOptionalBody);
  }
  open(): void {
    this.isOppened = true;
  }

  close(): void {
    this.isOppened = false;
  }
  toggle(): void {
    this.isOppened = !this.isOppened;
  }
}
