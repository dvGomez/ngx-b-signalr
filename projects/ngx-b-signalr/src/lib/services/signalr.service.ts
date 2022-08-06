import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { SignalRConfig, SIGNALR_CONFIG } from '../config/core.config';
import { SignalRSubscription } from '../subscriptions/SignalR.subcription';

@Injectable({
	providedIn: 'root'
})
export class SignalRService {


	static _listeners: {
		roomName: string,
		handlers: {Identifier : number, Handler : Function}[],
		baseListener: (...args: any[]) => void
	}[] = []

	static _hubConnection: HubConnection;

	static get HubConnection(): HubConnection {
		return this._hubConnection;
	}

	static RegisterRoomListener(roomName: string, handler: Function, handlerId : number) {
		var listener = this._listeners.find(x => x.roomName == roomName);
		if (!listener) {
			this._hubConnection.off(roomName);

			let baseListener = (...args: any[]) => {
				for (let i = 0; i < listener!.handlers.length; i++) {
					const handler = listener!.handlers[i];
					handler.Handler(...args);
				}
			}

			listener = {
				roomName: roomName,
				handlers: [],
				baseListener: baseListener
			};

			this._hubConnection.on(roomName, baseListener);

			this._listeners.push(listener);
		}
		listener.handlers.push({
            Handler: handler,
            Identifier: handlerId
        });
	}

	static UnregisterRoomListener(handlerId: number) {
		for (let index = this._listeners.length - 1; index >= 0; index--) {
			const listener = this._listeners[index];

			var handlerObjIndx = listener.handlers.findIndex(x => x.Identifier == handlerId);

			if (handlerObjIndx > -1) {
				listener.handlers.splice(handlerObjIndx, 1);
			}

			if (listener.handlers.length == 0) {
				this._hubConnection.off(listener.roomName, listener.baseListener);
				this._listeners.splice(index, 1);
			}
		}
	}

	get OnStatusChanged$(): Observable<HubConnectionState> {
		return this._onStatusChanged$;
	}

	private _onStatusChanged$: BehaviorSubject<HubConnectionState>;
	private currentState: HubConnectionState;

	constructor(@Inject(SIGNALR_CONFIG) private config : SignalRConfig) {
		
		SignalRService._hubConnection = new HubConnectionBuilder()
			.withUrl(config.signalrEndpoint)
			.configureLogging(LogLevel.Critical)
			.build();

		this.currentState = SignalRService.HubConnection.state;

		this._onStatusChanged$ = new BehaviorSubject(SignalRService.HubConnection.state);
		this.checkForHubHealth();
	}

	private checkForHubHealth() {
		setInterval(() => {
			if (SignalRService.HubConnection.state != this.currentState) {
				this.currentState = SignalRService.HubConnection.state;
				this._onStatusChanged$.next(this.currentState);
			}

			if (this.currentState == HubConnectionState.Disconnected) {
				this.connect();
			}

		}, 5000);
	}

	public async connect() {
		console.log(`Trying to establish a secure connection with server...`);
		await SignalRService.HubConnection.start()
			.then(x => {
			})
			.catch(err => {
				console.error(`It was not possible to connect at: ${this.config.signalrEndpoint}, trying again soon...`);
			});
	}

	public buildSubscription(roomName: string) {
		return new SignalRSubscription(roomName);
	}
}
