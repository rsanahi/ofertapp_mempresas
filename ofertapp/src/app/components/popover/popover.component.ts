import { Component, OnInit, Input, Inject } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '../../services/events.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [PopoverComponent]
})

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input('idioma') idioma=false;
  @Input('labels') labels={"es":"","en":""}

  constructor(
    public popoverController: PopoverController,
    private translate: TranslateService,
    private eventService: EventsService,
  ) { }

  ngOnInit() {}

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

  useLanguage(language: string) {
    this.translate.use(language);
    this.eventService.change_current_lenguaje(language);
    this.dismissPopover();
  }
}
