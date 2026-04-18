import type { App, Component, ComponentPublicInstance, Plugin } from 'vue';
import { createApp } from 'vue';
import type { MountAdapter } from './types';

export type VueMountHandle = App<Element>;
export type VueMountArtifact = Component;
export type VueMountInstance = ComponentPublicInstance;

export type CreateVueAdapterOptions = {
	getPlugins?: () => Plugin[];
};

export function createVueAdapter(
	options: CreateVueAdapterOptions = {}
): MountAdapter<Component, App<Element>, ComponentPublicInstance> {
	return {
		name: 'vue',
		mount({ mountPoint, artifact }) {
			const app = createApp(artifact);
			for (const plugin of options.getPlugins?.() ?? []) {
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
}
