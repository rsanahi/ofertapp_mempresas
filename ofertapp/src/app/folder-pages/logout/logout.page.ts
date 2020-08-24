import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.logout();
  }

  log_out_user(){
    this.authService.logout();
  }
}
