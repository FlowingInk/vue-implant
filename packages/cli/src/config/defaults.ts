import process from 'node:process';
import type {
	InjectorConfig,
	MonkeyBuildConfig,
	MonkeyConfig,
	MonkeyServerConfig,
	ResolvedSourceConfig
} from './type';

// default path
export const DEFAULT_GENERATED_ENTRY_DIR = '.rite';
export const DEFAULT_GENERATED_ENTRY_FILE = 'entry.ts';
export const DEFAULT_SOURCE_DIR = 'src/injections';

//default source config
export const DEFAULT_SOURCE_CONFIG: Omit<ResolvedSourceConfig, 'root'> = {
	dir: DEFAULT_SOURCE_DIR,
	include: ['**/*'],
	manifest: 'meta.ts',
	exclude: [],
	moduleEntry: ['index.vue', 'index.tsx', 'index.jsx'],
	moduleOverride: ['meta.ts']
};

export const DEFAULT_INJECTOR_CONFIG: Required<InjectorConfig> = {
	alive: false,
	scope: 'local',
	timeout: 5000
};

export const DEFAULT_MONKEY_SERVER_CONFIG: Required<MonkeyServerConfig> = {
	open: process.platform === 'win32' || process.platform === 'darwin',
	prefix: 'server:',
	mountGmApi: false
};

export const DEFAULT_MONKEY_BUILD_CONFIG: Pick<
	Required<MonkeyBuildConfig>,
	'metaFileName' | 'autoGrant'
> = {
	metaFileName: false,
	autoGrant: true
};

export const DEFAULT_MONKEY_CONFIG: Pick<MonkeyConfig, 'align' | 'clientAlias' | 'styleImport'> = {
	align: 2,
	clientAlias: '$',
	styleImport: true
};

export const DEFAULT_FILE_NAME_SUFFIX = '.user.js';
