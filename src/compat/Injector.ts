import type { Plugin } from 'vue';
import { createVueAdapter } from '../adapters/vue/VueAdapter';
import { VuePlugin } from '../adapters/vue/VuePlugin';
import { BaseInjector } from '../core/Injector/BaseInjector';
import type { InjectionConfig } from '../core/Injector/types';

export class Injector extends BaseInjector {
	constructor(config: Partial<InjectionConfig> = {}) {
		super(config);
		this.applyAdapter(createVueAdapter(this.getLogger()));
	}

	public use<T extends Plugin>(plugin: T): this {
		VuePlugin.use(plugin);
		return this;
	}

	public usePlugins(...plugins: Plugin[]): this {
		VuePlugin.usePlugins(...plugins);
		return this;
	}

	public getPlugins(): Plugin[] {
		return VuePlugin.getPlugins();
	}

	public setPinia<T extends Plugin>(pinia: T): void {
		VuePlugin.setPinia(pinia);
	}

	public getPinia(): Plugin | undefined {
		return VuePlugin.getPinia();
	}
}
