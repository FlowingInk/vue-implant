import fs from 'node:fs';
import path from 'node:path';
import { createJiti } from 'jiti';
import type { InjectionModuleConfig } from '../../config/type';

export async function loadMeta(root: string): Promise<InjectionModuleConfig | null> {
	const folders = fs.readdirSync(root).filter((name) => {
		const fullPath = path.join(root, name);
		return fs.statSync(fullPath).isDirectory();
	});
	if (folders.length === 0) {
		return null;
	}
	const jiti = createJiti(root);
	for (const f of folders) {
		const fileName: string = f.split('.')[0];
		if (fileName === 'meta') {
			return jiti.import(f);
		}
	}
	return null;
}
