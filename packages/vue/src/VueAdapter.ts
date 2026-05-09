import type { ComponentPublicInstance } from 'vue';
import { createApp } from 'vue';
import type { VueMountAdapter } from './type';
import { isVueComponent } from './util';
import { VuePlugin } from './VuePlugin';

export function createVueAdapter(): VueMountAdapter {
	const adapter: VueMountAdapter = {
		name: 'vue',
		matches: isVueComponent,
		mount({ mountPoint, artifact }) {
			const app = createApp(artifact);
			const plugins = VuePlugin.getPlugins();
			for (const plugin of plugins) {
				app.use(plugin);
			}
			const instance = app.mount(mountPoint) as ComponentPublicInstance;
			return {
				handle: app,
				instance
			};
		},
		unmount({ handle }) {
			handle.unmount();
		}
	};

	return adapter;
}
