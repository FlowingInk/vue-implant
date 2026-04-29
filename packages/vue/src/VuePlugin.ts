import type { Plugin } from 'vue';
import { Logger, type ILogger } from '@vue-implant/core';


class _VuePlugin {
	private plugins: Plugin[] = [];
	private logger: ILogger = new Logger();

	public setLogger(logger: ILogger): void {
		this.logger = logger;
	}

	public getPlugins(): Plugin[] {
		return [...this.plugins];
	}

	public use<T extends Plugin>(plugin: T): void {
		if (this.plugins.includes(plugin)) {
			this.logger.warn('Plugin already registered, skipping duplicate');
			return;
		}

		this.plugins.push(plugin);
	}

	public usePlugins(...plugins: Plugin[]): void {
		for (const plugin of plugins) {
			this.use(plugin);
		}
	}

	public clear(): void {
		this.plugins = [];
	}
}

export const VuePlugin = new _VuePlugin();

