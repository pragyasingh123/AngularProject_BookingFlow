import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageDataService {

  constructor() { }

  setStorageData(storageName: string, data: any, isJson: boolean) {
    if (isJson)
      sessionStorage.setItem(storageName, JSON.stringify(data));
    else
      sessionStorage.setItem(storageName, data);
  }

  getStorageData(storageName: string, isJson: boolean) {
    let data = sessionStorage.getItem(storageName);
    if (isJson)
      return JSON.parse(data);
   else
      return data;
  }

  getStorageDataModel(storageName: string, isJson: boolean, model: any) {
    let data = sessionStorage.getItem(storageName);
    if (isJson)
      return JSON.parse(data,model);
    else
      return data;
  }

  clearStorageData(storageName: string) {
    sessionStorage.removeItem(storageName);
  }

  cleanAll() {
    sessionStorage.clear()
  }
}
