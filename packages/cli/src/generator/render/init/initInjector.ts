import type { RenderInitResult } from '../../type';

export function renderInitInjector(): RenderInitResult {
	const instanceName: string = 'injector';
	return {
		code: [
			`const ${instanceName} = new Injector();`,
			`${instanceName}.applyAdapter(createVueAdapter(${instanceName}.getLogger()));`
		].join('\n'),
		instanceName
	};
}
