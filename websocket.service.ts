import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {filter, share} from 'rxjs/operators';
import {Request, Rsp, RspEvent, Topic} from '../../models/BeerbrewApi';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public ws: WebSocket;
  private addr = 'wss://dev.multimedianordic.no:10000';
  private readonly messages: Observable<Rsp<any>>;
  private messageQueue: string[] = [];

  private static addToken(addr: string): string {
    const token = localStorage.getItem('TOKEN');
    return token ? `${addr}?token=${token}` : addr;
  }

  constructor() {
    this.ws = new WebSocket(WebsocketService.addToken(this.addr));
    this.ws.onopen = () => {
      this.messageQueue.forEach(strMsg => this.ws.send(strMsg));
    };

    this.messages = Observable.create((sub: Subscriber<Rsp<any>>) => {
      this.ws.onmessage = m => {
        console.log(m);
        sub.next(JSON.parse(m.data));
      };
    }).pipe(share());
  }

  public on<T>(topic: Topic, event: RspEvent): Observable<Rsp<T>> {
    return this.messages.pipe(filter(msg =>
      msg.topic === topic && msg.event === event
    ));
  }

  public send<T>(request: Request<T>): void {
    const strMsg = JSON.stringify(request);

    console.log(strMsg);

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(strMsg);
    } else {
      this.messageQueue.push(strMsg);
    }
  }
}
