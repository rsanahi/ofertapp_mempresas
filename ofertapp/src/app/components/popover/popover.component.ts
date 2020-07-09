import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
  ) { }

  ngOnInit() {}

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

  useLanguage(language: string) {
    this.translate.use(language);
    this.dismissPopover();
  }
}
