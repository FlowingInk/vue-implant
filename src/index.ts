import { VuePlugin } from './adapters/vue/VuePlugin';
import { Injector } from './compat/Injector';
import { ObserverHub } from './core/hooks/ObserverHub';
import { Action } from './core/Injector/types';
import { createActivityStore } from './core/signal/observeActivitySignal';
import { DOMWatcher } from './core/watcher/DomWatcher';

export type {
	VueMountArtifact,
	VueMountHandle,
	VueMountInstance
} from './adapters/vue/type';
export type {
	AdapterMountInput,
	AdapterMountResult,
	AdapterResolver,
	AdapterUnmountInput,
	AdapterUnmountReason,
	MountAdapter,
	ResolvableMountAdapter
} from './core/adapter/types';

export type {
	LifecycleHookMap,
	ObserveEvent,
	ObserveEventName,
	ObserveHook
} from './core/hooks/type';
export type {
	ActionEvent,
	ArtifactOptions,
	ComponentOptions,
	InjectionConfig
} from './core/Injector/types';
export type { ILogger, LoggerLevel } from './core/logger/types';
export type {
	ActivitySignalSource,
	ActivitySignalSubscribable,
	SignalUnsubscribe
} from './core/signal/types';
export type { ListenerRegisterResult, RegisterResult } from './core/Task/types';
export { Action, createActivityStore, DOMWatcher, Injector, ObserverHub, VuePlugin };
