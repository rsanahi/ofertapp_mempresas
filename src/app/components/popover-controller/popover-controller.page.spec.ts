import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverControllerPage } from './popover-controller.page';

describe('PopoverControllerPage', () => {
  let component: PopoverControllerPage;
  let fixture: ComponentFixture<PopoverControllerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverControllerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverControllerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
