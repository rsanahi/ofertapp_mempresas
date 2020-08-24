import { Injectable } from '@angular/core';
import { Camera , CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { Platform} from '@ionic/angular';
import { File as Files, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ToastService } from '../ui/toast.service';
import { StorageService } from '../storage.service';
import { EventsService } from '../events.service';
import { Crop } from '@ionic-native/crop/ngx';

import { finalize } from 'rxjs/operators';
//import { join } from 'path';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  STORAGE_KEY = 'OfertappFolder';

  constructor(
    public webView: WebView,
    public camera: Camera,
    public file: Files,
    private toastService: ToastService,
    private storageService: StorageService,
    private eventService: EventsService,
    private crop: Crop,
  ) { }

  pathForImage(img){
    if(img === null){
      return '';
    }
    else {
      let converted = this.webView.convertFileSrc(img);
      return converted;
    }
  }

  take_picture(source){
    if(source == 'gallery'){
      this.take_picture_from(this.camera.PictureSourceType.PHOTOLIBRARY);
    }
    else{
      this.take_picture_from(this.camera.PictureSourceType.CAMERA);
    }
  }

  take_picture_from(sourceType: PictureSourceType){
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      this.crop.crop(imagePath, { quality: 100, targetWidth: -1, targetHeight: -1 })
      .then(
        imagePath => {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/')+1).split("?")[0];
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/')+1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
    });
  }

  copyFileToLocalDir(namePath, currentName, newFileName){
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then( _ => {
      this.updateStoredImages(newFileName);
    }, error => {
      console.log(error);
      this.toastService.presentToast("Error while storing file.");
    });
  }

  updateStoredImages(name){
    this.storageService.get(this.STORAGE_KEY).then(images => {

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newentry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.storageService.store(this.STORAGE_KEY, JSON.stringify(newentry));
      this.prepare_to_upload(newentry);
    });

  }

  prepare_to_upload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
    .then(entry => {
      (<FileEntry>entry).file(file => this.read_file(file))
    }).catch(err => {
      console.log(err);
      this.toastService.presentToast("Error while reading file");
    });
  }

  read_file(file:any){
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlod = new Blob([reader.result], {
        type: file.type
      });

      formData.append('logo', imgBlod, file.name);
      this.eventService.change_business_img_profile(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  createFileName(){
    var d = new Date();
    var n = d.getTime();
    var newFileName = n + ".jpg";
    return newFileName;
  }
}
