export function renderImportInjector(): string {
	return [
		"import { Injector } from '@vue-implant/core';",
		"import { createVueAdapter } from '@vue-implant/vue';"
	].join('\n');
}
