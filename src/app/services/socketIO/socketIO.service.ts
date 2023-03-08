import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketIOService {

    socketsMap: Map<string, Socket> = new Map();
    uri = environment.apiHost
    constructor(private socket: Socket) {
    }

    of(namespace: string): Socket {
        const socketInstance = new Socket({ url: `${this.uri}/${namespace}` })
        this.socketsMap.set(namespace, socketInstance);
        return socketInstance
    }

    getSocket(namespace:string){
        return this.socketsMap.get(namespace);
    }

    fromEvent(socket: Socket, event: string) {
        return socket.fromEvent(event);
    }

    emit<T>(socket: Socket, event: string,payload:T) {
        return socket.emit(event,payload);
    }

    disconnect(namespace: string, all?: boolean): void {
        const socketInstace = this.socketsMap.get(namespace);
        socketInstace.disconnect();
        this.socketsMap.delete(namespace);
    }

    get connection() {
        return this.socket.fromEvent('connect').pipe(
            shareReplay(1)
        );
    }

}