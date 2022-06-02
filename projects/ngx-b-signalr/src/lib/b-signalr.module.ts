import { ModuleWithProviders, NgModule } from '@angular/core';
import { SignalRConfig, SIGNALR_CONFIG } from './config/core.config';

@NgModule({
	declarations: [
	],
	imports: [
	],
	exports: [
	]
})
export class BSignalrModule {
	static forRoot(config : SignalRConfig) : ModuleWithProviders<BSignalrModule> {
		return {
			ngModule: BSignalrModule,
			providers: [
				{
					provide: SIGNALR_CONFIG,
					useValue: config
				}
			]
		}
	}
}
