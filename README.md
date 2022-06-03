# NGX-B Signal-R


## Installation

1. **Dependency:**
Before add the lib to your project, install de signalr official lib ([click here](https://www.npmjs.com/package/@microsoft/signalr) or):
	```
    npm install @microsoft/signalr@6.0.5
	```

	You can install the library using:

	**npm:**
	```
    npm install ngx-b-toolkit
	```

2. Add the **BSignalrModule** to your `app.module.ts` and import your environment variable:

	```ts
    @NgModule({
        declarations: [
            ...
        ],
        imports: [
            ...
            BSignalrModule.forRoot(environment),
        ],
    })
	```
3. Implement the interface **SignalRConfig** to **environment.ts** and set the url for you signalr server:
	```ts
    export  const  environment: SignalRConfig | any  = {
        ...,
        signalrEndpoint:  "http://localhost:7001/hub"
    }
	```

4. Call startup method in your **app.component.ts** **or in application initializer**:
	```ts
    export  class  AppComponent {
        title  =  '...';
        
        constructor(private  signalRService : SignalRService) {
            this.signalRService.connect();
        }
    }
	```

## Getting Started

The library provides an easy interface to connect to your Signal-R server.

**Create a subscription:**

The subscription is a way to receive messages from a specified room.

1. Instance a new **SignalRSubscription** and listen for a message room:
	
	```ts
    import { SignalRService, SignalRSubscription } from  'ngx-b-signalr';

    ...

    subscription! : SignalRSubscription<CollectorState>;
    
    constructor(private  signalRService : SignalRService) {
        this.subscription = this.signalRService.buildSubscription(`ROOM`);
        this.subscription.OnMessageReceived$.subscribe(x  => {
            console.log('Response: ', x);
        }
    }
	```
	
2. Always call **.destroy()** on your **OnDestroy()** method to unsubscribe:
	```ts
    ngOnDestroy():  void {
        this.subscription.destroy();
    }
	```


## Compatibility

|Framework|Version  |
|-----------|--|
|Angular           | 13.x.x |
|Microsoft.AspNetCore.SignalR| 1.1.0

> Tip: The lib was not tested in previous versions of angular, fell free to give us a feedback ;)