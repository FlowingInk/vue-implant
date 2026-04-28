import { readdirSync } from 'node:fs';
import path from 'node:path';
import { createJiti } from 'jiti';
import type { InjectionManifest } from '../../config/type';

export async function loadManifest(root: string): Promise<InjectionManifest | null> {
	const jiti = createJiti(root);
	for (const entry of readdirSync(root)) {
		const fullPath = path.join(root, entry);
		if (path.parse(entry).name === 'meta') {
			return jiti.import(fullPath);
		}
	}
	return null;
}
