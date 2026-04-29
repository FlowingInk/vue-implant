import type { InjectionFramework, ResolvedInjectionModule } from '../../../config/type';
import type { RenderImportResult } from '../../type';

export function renderImportAdapter(injections: ResolvedInjectionModule[]): RenderImportResult {
	const framworkSet: Set<InjectionFramework> = new Set();
	injections.forEach((injection) => {
		framworkSet.add(injection.framework);
	});

	const adapterImports = Array.from(framworkSet).map((adapter) => {
		return '';
	});

	return {
		code: adapterImports.join('\n'),
		importsName: [...Array.from(framworkSet)]
	};
}
