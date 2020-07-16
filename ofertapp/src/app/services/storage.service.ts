import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async store(storageKey: string, value:any){

    const scryptedValue = btoa(escape(JSON.stringify(value)));
    await Storage.set({
      key: storageKey,
      value: scryptedValue
    });
  }

  async get(storageKey: string){
    const res = await Storage.get({key:storageKey});
    if(res.value){
      return escape(atob(res.value));
    }
    else{
      return false;
    }
  }

  async remove(storageKey: string){
    await Storage.remove({key: storageKey});
  }

  async clear(){
    await Storage.clear();
  }
}
