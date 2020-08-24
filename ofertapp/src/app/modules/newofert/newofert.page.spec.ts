import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewofertPage } from './newofert.page';

describe('NewofertPage', () => {
  let component: NewofertPage;
  let fixture: ComponentFixture<NewofertPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewofertPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewofertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
