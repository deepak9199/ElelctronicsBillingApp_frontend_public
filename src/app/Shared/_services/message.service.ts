import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  message = ''
  constructor() { }
  getmessage() {
    return this.message
  }
  setmessage(message: string) {
    this.message = message
  }
}
