import type { ArtifactOptions, InjectionConfig as RuntimeInjectionConfig } from '@rite/core';
import type { MonkeyUserScript } from 'vite-plugin-monkey';

export type Thenable<T> = T | Promise<T>;

export type MonkeyMode = 'serve' | 'build' | 'meta';

export type MonkeyGenerateContext = {
	userscript: string;
	mode: MonkeyMode;
};

export type MonkeyServerConfig = {
	open?: boolean;
	prefix?: string | ((name: string) => string) | false;
	mountGmApi?: boolean;
};

export type MonkeyBuildConfig = {
	fileName?: string;
	metaFileName?: string | boolean | ((fileName: string) => string);
	autoGrant?: boolean;
	systemjs?:
		| 'inline'
		| ((
				version: string,
				packageName: string,
				importName: string,
				resolveName: string
		  ) => string);
	cssSideEffects?: string | ((css: string) => void);
};

export type MonkeyLegacyFormatConfig = {
	align?: unknown;
	generate?: unknown;
};

export type MonkeyConfig = {
	entry?: string;
	userscript?: MonkeyUserScript;
	align?: number | false;
	generate?: (options: MonkeyGenerateContext) => Thenable<string>;
	clientAlias?: string;
	styleImport?: boolean;
	server?: MonkeyServerConfig;
	build?: MonkeyBuildConfig;
	format?: MonkeyLegacyFormatConfig;
};

export type AppConfig = {
	name: string;
	version: string;
	description?: string;
};

export type SourceConfig = {
	root?: string;
	dir?: string;
	include?: string[];
	exclude?: string[];
	manifest?: string;
	moduleEntry?: string | string[];
	moduleOverride?: string | string[];
};

export type ResolvedSourceConfig = {
	root: string;
	dir: string;
	include: string[];
	exclude: string[];
	manifest: string;
	moduleEntry: string[];
	moduleOverride: string[];
};

export type InjectorConfig = Partial<Pick<RuntimeInjectionConfig, 'alive' | 'scope' | 'timeout'>>;

export type ResolvedInjectorConfig = Pick<RuntimeInjectionConfig, 'alive' | 'scope' | 'timeout'>;

export type InjectionFramework = 'auto' | 'vue' | 'react';

export type ResolvedInjectionFramework = Exclude<InjectionFramework, 'auto'>;

export type InjectionModuleConfig = ArtifactOptions & {
	name?: string;
	injectAt: string;
	component?: string;
	framework?: InjectionFramework;
	enabled?: boolean;
	match?: string[];
	include?: string[];
	exclude?: string[];
	excludeMatch?: string[];
};

export type InjectionManifestRecord = Record<string, Omit<InjectionModuleConfig, 'name'>>;

export type InjectionManifest = InjectionModuleConfig[] | InjectionManifestRecord;

export type ResolvedInjectionManifest = InjectionModuleConfig[];

export type ResolvedInjectionModule = Omit<
	InjectionModuleConfig,
	'name' | 'component' | 'framework' | 'enabled' | 'alive' | 'scope' | 'timeout'
> & {
	moduleId: string;
	componentPath: string;
	framework: ResolvedInjectionFramework;
	moduleDir: string;
	overridePath?: string;
	enabled: boolean;
	alive: ResolvedInjectorConfig['alive'];
	scope: ResolvedInjectorConfig['scope'];
	timeout: ResolvedInjectorConfig['timeout'];
};

export type ResolvedMonkeyServerConfig = {
	open: boolean;
	prefix: string | ((name: string) => string) | false;
	mountGmApi: boolean;
};

export type ResolvedMonkeyBuildConfig = {
	fileName: string;
	metaFileName: string | false;
	autoGrant: boolean;
	systemjs?: MonkeyBuildConfig['systemjs'];
	cssSideEffects?: MonkeyBuildConfig['cssSideEffects'];
};

export type ResolvedMonkeyConfig = Omit<
	MonkeyConfig,
	'entry' | 'userscript' | 'align' | 'clientAlias' | 'styleImport' | 'server' | 'build'
> & {
	entry: string;
	userscript: MonkeyUserScript;
	align: number | false;
	clientAlias: string;
	styleImport: boolean;
	server: ResolvedMonkeyServerConfig;
	build: ResolvedMonkeyBuildConfig;
};

// config type
export type CliConfig = {
	app: AppConfig;
	monkey?: MonkeyConfig;
	source?: SourceConfig;
	injector?: InjectorConfig;
};
// CliConfig -> ResolvedConfig
//resolved config type
export type ResolvedConfig = {
	root: string;
	app: AppConfig;
	monkey: ResolvedMonkeyConfig;
	source: ResolvedSourceConfig;
	injector: ResolvedInjectorConfig;
};
