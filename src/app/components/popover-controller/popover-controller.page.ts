import { Component, OnInit, Input, Inject } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-popover-controller',
  templateUrl: './popover-controller.page.html',
  styleUrls: ['./popover-controller.page.scss'],
})
export class PopoverControllerPage implements OnInit {

  constructor(
    public popoverController: PopoverController,
    private translate: TranslateService,
    private eventService: EventsService,
  ) { }

  ngOnInit() {
  }

  @Input('idioma') idioma=false;
  @Input('labels') labels={"es":"","en":""}

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

  useLanguage(language: string) {
    this.translate.use(language);
    this.eventService.change_current_lenguaje(language);
    this.dismissPopover();
  }

}
