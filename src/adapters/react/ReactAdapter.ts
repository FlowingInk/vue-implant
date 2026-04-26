import { createRoot } from 'react-dom/client';
import type { ReactMountAdapter } from './type';
import { isReactElement } from './util';

export function createReactAdapter(): ReactMountAdapter {
	return {
		name: 'react',
		matches: isReactElement,
		mount({ mountPoint, artifact }) {
			const root = createRoot(mountPoint);
			root.render(artifact);
			return {
				handle: root
			};
		},
		unmount({ handle }) {
			handle.unmount();
		}
	};
}
