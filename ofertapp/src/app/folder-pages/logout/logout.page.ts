import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { AuthConstants } from '../../config/auth-constants';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.log_out_user();
  }

  log_out_user(){
    this.authService.logout().subscribe((res:any)=>{
      this.storageService.clear().then(res=>{
        this.router.navigate(['']);
      });
    });


  }
}
