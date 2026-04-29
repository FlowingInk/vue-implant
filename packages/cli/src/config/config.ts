import type {
	CliConfig,
	InjectionManifest,
	InjectionManifestRecord,
	InjectionModuleConfig
} from './type';

type StrictShape<Shape, Value extends Shape> = Value &
	Record<Exclude<keyof Value, keyof Shape>, never>;

export const defineConfig = <T extends CliConfig>(config: StrictShape<CliConfig, T>): T => config;

export const defineInjection = <T extends InjectionModuleConfig>(
	config: StrictShape<InjectionModuleConfig, T>
): T => config;

export function defineInjections<T extends InjectionModuleConfig[]>(manifest: T): T;
export function defineInjections<T extends InjectionManifestRecord>(manifest: T): T;
export function defineInjections<T extends InjectionManifest>(manifest: T): T {
	return manifest;
}
