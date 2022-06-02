import { InjectionToken } from "@angular/core";

export interface SignalRConfig {
    signalrEndpoint: string;
}

export const SIGNALR_CONFIG = new InjectionToken("SIGNALR_CONFIG");