import type { InjectionFramework, ResolvedInjectionModule } from '../../../config/type';
import type { RenderImportResult } from '../../type';

export function renderImportAdapter(injections: ResolvedInjectionModule[]): RenderImportResult {
	const frameworkSet: Set<InjectionFramework> = new Set();
	injections.forEach((injection) => {
		frameworkSet.add(injection.framework);
	});

	const adapterImports = Array.from(frameworkSet).map((adapter) => {
		if (adapter === 'react') {
			return "import { createReactAdapter } from '@vue-implant/react';";
		}

		return '';
	});

	return {
		code: adapterImports.filter(Boolean).join('\n'),
		importsName: [...Array.from(frameworkSet)]
	};
}

