import { Observable, Subject } from "rxjs";
import { SignalRService } from "../services/signalr.service";

export class SignalRSubscription<TEntity = any> {

    private _room : string;
    private _onMessageReceived$ : Subject<TEntity>;

    get OnMessageReceived$() : Observable<TEntity> {
        return this._onMessageReceived$;
    }

    constructor(roomName : string) {
        this._onMessageReceived$ = new Subject();
        this._room = roomName;
        this.init();
    }

    public destroy() {
        SignalRService.UnregisterRoomListener(this.onMessageReceived.bind(this));
    }

    private init() {
        SignalRService.RegisterRoomListener(this._room, this.onMessageReceived.bind(this));
    }

    private onMessageReceived(result : TEntity){
        this._onMessageReceived$!.next(result);
    }
}