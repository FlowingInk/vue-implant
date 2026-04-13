import type { ObserveEvent } from '../core/hooks/type';
import type { TaskKind, TaskStatus } from '../core/Task/types';

type RegisterObserveEventName =
	| 'register:start'
	| 'register:success'
	| 'register:duplicate'
	| 'register:error';

type RegisterObserveMeta = {
	componentName?: string;
	listenerEvent?: string;
	listenAt?: string;
	alive?: boolean;
	scope?: 'local' | 'global';
	timeout?: number;
	withEvent?: boolean;
};

type RegisterObserveIdentityMeta = Pick<RegisterObserveMeta, 'componentName' | 'listenerEvent'>;

type RegisterObserveBase = {
	taskId: string;
	kind: TaskKind;
	injectAt: string;
	status: TaskStatus;
};

type RegisterObserveInputByName = {
	'register:start': RegisterObserveBase & RegisterObserveMeta;
	'register:success': RegisterObserveBase & RegisterObserveMeta;
	'register:duplicate': RegisterObserveBase & RegisterObserveIdentityMeta;
	'register:error': RegisterObserveBase & RegisterObserveIdentityMeta & { error: unknown };
};

type RegisterObservePayloadByName = {
	'register:start': Omit<ObserveEvent, 'name' | 'ts'> & { meta: RegisterObserveMeta };
	'register:success': Omit<ObserveEvent, 'name' | 'ts'> & { meta: RegisterObserveMeta };
	'register:duplicate': Omit<ObserveEvent, 'name' | 'ts'> & { meta: RegisterObserveIdentityMeta };
	'register:error': Omit<ObserveEvent, 'name' | 'ts'> & {
		error: unknown;
		meta: RegisterObserveIdentityMeta;
	};
};

export function buildRegisterObservePayload<T extends RegisterObserveEventName>(
	name: T,
	input: RegisterObserveInputByName[T]
): RegisterObservePayloadByName[T] {
	const base = {
		taskId: input.taskId,
		kind: input.kind,
		injectAt: input.injectAt,
		status: input.status
	};

	if (name === 'register:start' || name === 'register:success') {
		const typedInput = input as
			| RegisterObserveInputByName['register:start']
			| RegisterObserveInputByName['register:success'];

		return {
			...base,
			meta: {
				componentName: typedInput.componentName,
				listenerEvent: typedInput.listenerEvent,
				listenAt: typedInput.listenAt,
				alive: typedInput.alive,
				scope: typedInput.scope,
				timeout: typedInput.timeout,
				withEvent: typedInput.withEvent
			}
		} as RegisterObservePayloadByName[T];
	}

	if (name === 'register:duplicate') {
		const typedInput = input as RegisterObserveInputByName['register:duplicate'];
		return {
			...base,
			meta: buildIdentityMeta(typedInput)
		} as RegisterObservePayloadByName[T];
	}

	const typedInput = input as RegisterObserveInputByName['register:error'];

	return {
		...base,
		error: typedInput.error,
		meta: buildIdentityMeta(typedInput)
	} as RegisterObservePayloadByName[T];
}

function buildIdentityMeta(input: RegisterObserveIdentityMeta): RegisterObserveIdentityMeta {
	if (input.componentName !== undefined) {
		return { componentName: input.componentName };
	}

	if (input.listenerEvent !== undefined) {
		return { listenerEvent: input.listenerEvent };
	}

	return {};
}
