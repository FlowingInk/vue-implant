import { readdirSync } from 'node:fs';
import path from 'node:path';
import { resolveConfig, resolveInjection, resolveInjections } from '../config/resolve';
import type { ResolvedInjectionModule } from '../config/type';
import { loadConfig } from './load/loadConfig';
import { loadManifest } from './load/loadManifes';
import { loadMeta } from './load/loadMeta';
import type { ScannerResult } from './type';
import { mergeMeta } from './util';

export async function scanner(): Promise<ScannerResult> {
	const { config, root } = await loadConfig();
	const manifest = await loadManifest(root);
	if (!manifest) {
		throw new Error('No manifest found');
	}

	const _resolveConfig = resolveConfig(config);
	const resolveManifest = resolveInjections(manifest, {
		root: _resolveConfig.root,
		source: _resolveConfig.source,
		injector: _resolveConfig.injector
	});
	const folder = readdirSync(_resolveConfig.source.dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name);

	const injectionsMeta: ResolvedInjectionModule[] = [];
	for (const module of folder) {
		const modulePath = path.join(_resolveConfig.source.dir, module);
		//check module level config
		const meta = await loadMeta(modulePath);
		if (!meta) {
			continue;
		}
		const resolveMeta = resolveInjection(meta.moduleConfig, {
			root: _resolveConfig.root,
			source: _resolveConfig.source,
			injector: _resolveConfig.injector,
			moduleDir: modulePath,
			fallbackName: module,
			overridePath: meta.overridePath
		});
		injectionsMeta.push(resolveMeta);
	}

	const injections = mergeMeta(resolveManifest, injectionsMeta);
	injections.sort((a, b) => a.moduleId.localeCompare(b.moduleId));

	return {
		config: _resolveConfig,
		injections
	};
}
