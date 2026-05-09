import type { ResolvedInjectorConfig } from 'src/config/type';
import type { RenderInitResult } from '../../type';

export function renderInitInjector(
	frameworks: string[],
	globlaConfig: ResolvedInjectorConfig
): RenderInitResult {
	const instanceName: string = 'injector';
	const initInjector: string = `const ${instanceName} = new Injector(${JSON.stringify(globlaConfig)});`;
	const applyAdapters: string = frameworks
		.map((framework) => `${instanceName}.applyAdapter(create${framework}Adapter());`)
		.join('\n');
	return {
		code: [initInjector, applyAdapters].join('\n'),
		instanceName
	};
}
