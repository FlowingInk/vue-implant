import type { App, Component, ComponentPublicInstance, Ref, WatchHandle, WatchSource } from 'vue';
import type { LifecycleHookMap } from '../hooks/type';

export type TaskRecord = {
	taskId: string;
	injectAt: string;
};

export type TaskErrorMessage = {
	taskId: string;
	injectAt: string;
};

export type TaskStatus = 'idle' | 'pending' | 'active';
export type TaskKind = 'component' | 'listener';

export type Task = {
	taskId: string;
	kind: TaskKind;
	taskStatus?: TaskStatus;

	// component info
	app?: App<Element>;
	appRoot?: HTMLElement;
	componentName?: string;
	componentInjectAt?: string;
	component?: Component;
	instance?: ComponentPublicInstance;

	// listener info
	listenerName?: string;
	withEvent?: boolean;
	listenAt?: string;
	event?: string;
	callback?: EventListener;
	controller?: AbortController;
	activitySignal?: () => Ref<boolean>;

	// watcher info
	watcher?: WatchHandle;
	watchSource?: WatchSource<boolean>;

	// task info
	isObserver?: boolean;
	alive?: boolean;
	aliveEpoch?: number;
	scope?: 'local' | 'global';
	timeout?: number;
	hooks?: LifecycleHookMap;

	disableAlive?: () => void;
};

export type ListenerRegisterResult = {
	taskId: string;
	isSuccess: boolean;
};

export type RegisterResult = {
	taskId: string;
	isSuccess: boolean;
	enableAlive: () => void;
	disableAlive: () => void;
};

export type _RegisterResult = {
	taskId: string;
	isSuccess: boolean;
};

export type _InjectResult = {
	isSuccess: boolean;
	error?: unknown;
};
