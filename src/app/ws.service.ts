import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import config from './config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  constructor(private authService: AuthService) { }

  connect(path = '/', query: { [key: string]: string | number } = {}, options: SocketIOClient.ConnectOpts = {}) {
    const session = this.authService.session();

    const queries = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    const queryString = queries ? `&${queries}` : '';

    console.log(`${config.api_url}${path}?token=${session.token}${queryString}`)

    return io(`${config.api_url}${path}?token=${session.token}${queryString}`, options);
  }

  prepare_data(encapsulator): string { 
    return encodeURI(JSON.stringify(encapsulator))
  }
}
