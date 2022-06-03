import { Observable, Subject } from "rxjs";
import { SignalRService } from "../services/signalr.service";

export class SignalRSubscription<TEntity = any> {

    private _room : string;
    private _onMessageReceived$ : Subject<TEntity>;
    private handlerId : number;

    get OnMessageReceived$() : Observable<TEntity> {
        return this._onMessageReceived$;
    }

    constructor(roomName : string) {
        this._onMessageReceived$ = new Subject();
        this._room = roomName;
        this.handlerId = this.GenerateUniqueId();
        this.init();
    }

    public destroy() {
        SignalRService.UnregisterRoomListener(this.handlerId);
    }

    private init() {
        SignalRService.RegisterRoomListener(this._room, this.onMessageReceived.bind(this), this.handlerId);
    }

    private onMessageReceived(result : TEntity){
        this._onMessageReceived$!.next(result);
    }

    GenerateUniqueId(length=16) {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
      }
}