import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SecurityStorageService {
  private cryptoKey = '3773a6eee176c1073bd49f6453133e24551e28dd9699a4491494fe3bb56945c3';

  constructor() {}
  /** saves the object in storage and encrypts it */
  save<T>(key: string, data: T): void {
    const dataSt = CryptoJS.AES.encrypt(JSON.stringify(data), this.cryptoKey).toString();
    localStorage.setItem(key, dataSt);
  }

  /** @returns the object that was previously stored and encrypted */
  get<T>(key: string): T {
    const data = <any>localStorage.getItem(key);
    let decryptedData = null;
    if (data) {
      let bytes = CryptoJS.AES.decrypt(data.toString(), this.cryptoKey);
      decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return decryptedData;
  }

  /** remove data stored by key */
  remove(...keys: string[]): void {
    keys.forEach((key) => localStorage.removeItem(key));
  }

  /** remove all data stored for this app */
  clear(): void {
    localStorage.clear();
  }
}
