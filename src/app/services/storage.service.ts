import { Injectable } from '@angular/core';
import { Storage  } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage,
  ) { }

  async store(storageKey: string, value:any){
    const scryptedValue = btoa(escape(JSON.stringify(value)));
    await this.storage.set(storageKey,value);
  }

  async get(storageKey: string){
    let data = await this.storage.get(storageKey).then((val) => {
      if(val){
        //return escape(atob(res.value));
        return val;
      }
      else{
        return '';
      }
    }).catch((error) =>{
      console.log(error);
    });

    return data;
  }

  async remove(storageKey: string){
    await this.storage.remove(storageKey);
  }

  async clear(){
    await this.storage.clear();
  }
}
