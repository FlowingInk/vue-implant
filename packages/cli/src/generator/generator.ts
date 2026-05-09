import type { ScannerResult } from 'src/scanner/type';
import { renderImportAdapter } from './render/import/importAdapter';
import { renderImportComp } from './render/import/importComp';
import { renderImportInjector } from './render/import/importInjector';
import { renderInitInjector } from './render/init/initInjector';

export function generate(sannerResult: ScannerResult): string {
	const importCode = [
		renderImportComp(sannerResult.injections).code,
		renderImportInjector(),
		renderImportAdapter(sannerResult.injections).code
	].join('\n');
	const initInjectorCode = [renderInitInjector(sannerResult.config.frameworks, sannerResult.config.injector).code].join('\n');
	return [importCode, initInjectorCode].join('\n');
}
