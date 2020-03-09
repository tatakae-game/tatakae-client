import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import config from './config';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  socket: SocketIOClient.Socket = null;

  constructor() { }

  connect(force = false) {
    if (force || !this.socket?.connected) {
      this.socket = io(config.api_url);
    }

    return this.socket;
  }
}
