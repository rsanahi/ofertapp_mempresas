import { Component, OnInit, NgZone } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastService } from '../../services/ui/toast.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

  scan_activate:Boolean = false;
  qrBack:any;
  scanSub=null;

  constructor(
    private qrScanner: QRScanner,
    private toastService: ToastService,
    private zone: NgZone,
  ) { }

  ngOnInit() {
  }

  start_scan(){
    this.scan_activate = true;
    
    this.qrBack = document.getElementById("qr_back");
    if(this.qrBack != null){
      this.qrBack.classList.add("qr_back");
    }


  this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted
        this.qrScanner.show();
        if(this.qrBack != null){
          this.qrBack.classList.add("qr_back");
          this.qrBack.classList.remove("qr_back_disabled");
        }
        
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.stop_scan();
          this.toastService.presentToast("Codigo escaneado jeje");
          
        });

      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
    })
    .catch((e: any) => console.log('Error is', e));
    
  }

  stop_scan(){
    (this.scanSub) ? this.scanSub.unsubscribe() : null;
    this.scanSub=null;

    if(this.qrScanner){
      this.qrScanner.hide();
      this.qrScanner.destroy();
    }
    
    if(this.qrBack){
      this.qrBack.classList.remove("qr_back");
      this.qrBack.classList.add("qr_back_disabled");
    }
    this.zone.run(()=>{this.scan_activate = false;});
    
  }

  ionViewWillLeave(){
    this.stop_scan();
  }

}
