import type { CliConfig, ResolvedConfig, ResolvedInjectionModule } from '../config/type';

export type LoadedConfig = {
	config: CliConfig;
	configFile: string;
	root: string;
};

export type ScannerResult = {
	config: ResolvedConfig;
	injections: ResolvedInjectionModule[];
};
