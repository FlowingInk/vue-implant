import type { ObserverHub } from '../core/hooks/ObserverHub';
import type { LifecycleHookMap, ObserveEventName, ObserveHook } from '../core/hooks/type';

export function registerHooks(
	observer: ObserverHub,
	hooks?: LifecycleHookMap,
	taskId?: string
): void {
	if (!hooks) return;

	for (const [eventName, hookOrHooks] of Object.entries(hooks) as Array<
		[ObserveEventName, ObserveHook | ObserveHook[] | undefined]
	>) {
		if (!hookOrHooks) continue;

		const hooksToRegister = Array.isArray(hookOrHooks) ? hookOrHooks : [hookOrHooks];
		for (const hook of hooksToRegister) {
			if (taskId) {
				observer.onTask(taskId, eventName, hook);
			} else {
				observer.on(eventName, hook);
			}
		}
	}
}
