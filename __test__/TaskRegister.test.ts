import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { ObserverHub } from '../src/core/hooks/ObserverHub';
import type { ObserveEvent } from '../src/core/hooks/type';
import { TaskContext } from '../src/core/Task/TaskContext';
import { TaskRegister } from '../src/core/Task/TaskRegister';
import { createObserveEmitter } from '../src/util/createObserveEmitter';

describe('TaskRegister', () => {
	let taskContext: TaskContext;
	let taskRegister: TaskRegister;

	beforeEach(() => {
		const observer = new ObserverHub();
		taskContext = new TaskContext();
		taskRegister = new TaskRegister(
			taskContext,
			{
				alive: false,
				scope: 'local',
				timeout: 5000
			},
			createObserveEmitter(observer)
		);
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	it('should register a component task with defaults', () => {
		const result = taskRegister.register('#app', { name: 'CompA' });
		const context = taskContext.get(result.taskId);

		expect(result).toEqual({ taskId: 'CompA@#app', isSuccess: true });
		expect(context?.componentName).toBe('CompA');
		expect(context?.alive).toBe(false);
		expect(context?.scope).toBe('local');
		expect(taskContext.taskRecords).toEqual([{ taskId: 'CompA@#app', injectAt: '#app' }]);
	});

	it('should use option override for alive and scope', () => {
		const result = taskRegister.register(
			'#root',
			{ name: 'CompB' },
			{ alive: true, scope: 'global' }
		);
		const context = taskContext.get(result.taskId);

		expect(context?.alive).toBe(true);
		expect(context?.scope).toBe('global');
	});

	it('should store event config and activity signal when provided', () => {
		const signal = ref(true);
		const callback = vi.fn();

		const result = taskRegister.register(
			'#event-host',
			{ name: 'CompC' },
			{
				on: {
					listenAt: '#btn',
					type: 'click',
					callback,
					activitySignal: () => signal
				}
			}
		);

		const context = taskContext.get(result.taskId);
		expect(context?.withEvent).toBe(true);
		expect(context?.listenAt).toBe('#btn');
		expect(context?.event).toBe('click');
		expect(context?.callback).toBe(callback);
		expect(context?.activitySignal?.()).toBe(signal);
	});

	it('should return existing result for duplicate component registration', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const first = taskRegister.register('#dup', { name: 'CompDup' });
		const second = taskRegister.register('#dup', { name: 'CompDup' });

		expect(second).toEqual(first);
		expect(taskContext.taskRecords).toHaveLength(1);
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('already registered'));
	});

	it('should reuse generated anonymous name for same component reference', () => {
		const anonymous = {};
		const a = taskRegister.register('#a', anonymous);
		const b = taskRegister.register('#b', anonymous);

		expect(a.taskId.split('@')[0]).toBe(b.taskId.split('@')[0]);
	});

	it('should register listener-only task', () => {
		const callback = vi.fn();
		const result = taskRegister.registerListener('#btn', 'click', callback);
		const context = taskContext.get(result.taskId);

		expect(result).toEqual({ taskId: 'listener-#btn-click', isSuccess: true });
		expect(context?.withEvent).toBe(true);
		expect(context?.listenAt).toBe('#btn');
		expect(context?.event).toBe('click');
		expect(context?.callback).toBe(callback);
	});

	it('should return existing result for duplicate listener registration', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const first = taskRegister.registerListener('#btn', 'click', vi.fn());
		const second = taskRegister.registerListener('#btn', 'click', vi.fn());

		expect(second).toEqual(first);
		expect(taskContext.taskRecords).toHaveLength(1);
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('already registered'));
	});

	it('should emit normalized register payloads for component registration', () => {
		const observer = new ObserverHub();
		const registerWithObserver = new TaskRegister(
			taskContext,
			{
				alive: false,
				scope: 'local',
				timeout: 5000,
				observer
			},
			createObserveEmitter(observer)
		);
		const events: ObserveEvent[] = [];
		observer.onAny((event) => {
			if (event.name.startsWith('register:')) {
				events.push(event);
			}
		});

		const first = registerWithObserver.register('#obs', { name: 'ObsComp' });
		registerWithObserver.register('#obs', { name: 'ObsComp' });

		expect(events).toHaveLength(4);

		expect(events[0]).toMatchObject({
			name: 'register:start',
			taskId: first.taskId,
			kind: 'component',
			injectAt: '#obs',
			status: 'idle'
		});
		expect(events[0].meta).toEqual({
			componentName: 'ObsComp',
			listenerEvent: undefined,
			listenAt: undefined,
			alive: false,
			scope: 'local',
			timeout: 5000,
			withEvent: false
		});

		expect(events[1]).toMatchObject({
			name: 'register:success',
			taskId: first.taskId,
			kind: 'component',
			injectAt: '#obs',
			status: 'idle'
		});
		expect(events[1].meta).toEqual({
			componentName: 'ObsComp',
			listenerEvent: undefined,
			listenAt: undefined,
			alive: false,
			scope: 'local',
			timeout: 5000,
			withEvent: false
		});

		expect(events[2]).toMatchObject({
			name: 'register:start',
			taskId: first.taskId,
			kind: 'component',
			injectAt: '#obs',
			status: 'idle'
		});
		expect(events[2].meta).toEqual({
			componentName: 'ObsComp',
			listenerEvent: undefined,
			listenAt: undefined,
			alive: false,
			scope: 'local',
			timeout: 5000,
			withEvent: false
		});

		expect(events[3]).toMatchObject({
			name: 'register:duplicate',
			taskId: first.taskId,
			kind: 'component',
			injectAt: '#obs',
			status: 'idle',
			meta: {
				componentName: 'ObsComp'
			}
		});
		expect(events[3].meta).toEqual({
			componentName: 'ObsComp'
		});
	});

	it('should emit normalized register payloads for listener registration', () => {
		const observer = new ObserverHub();
		const registerWithObserver = new TaskRegister(
			taskContext,
			{
				alive: false,
				scope: 'local',
				timeout: 5000,
				observer
			},
			createObserveEmitter(observer)
		);
		const events: ObserveEvent[] = [];
		observer.onAny((event) => {
			if (event.name.startsWith('register:')) {
				events.push(event);
			}
		});

		const first = registerWithObserver.registerListener('#btn-obs', 'click', vi.fn());
		registerWithObserver.registerListener('#btn-obs', 'click', vi.fn());

		expect(events).toHaveLength(4);

		expect(events[0]).toMatchObject({
			name: 'register:start',
			taskId: first.taskId,
			kind: 'listener',
			injectAt: '#btn-obs',
			status: 'idle'
		});
		expect(events[0].meta).toEqual({
			componentName: undefined,
			listenerEvent: 'click',
			listenAt: '#btn-obs',
			alive: undefined,
			scope: undefined,
			timeout: undefined,
			withEvent: true
		});

		expect(events[1]).toMatchObject({
			name: 'register:success',
			taskId: first.taskId,
			kind: 'listener',
			injectAt: '#btn-obs',
			status: 'idle'
		});
		expect(events[1].meta).toEqual({
			componentName: undefined,
			listenerEvent: 'click',
			listenAt: '#btn-obs',
			alive: undefined,
			scope: undefined,
			timeout: undefined,
			withEvent: true
		});

		expect(events[2]).toMatchObject({
			name: 'register:start',
			taskId: first.taskId,
			kind: 'listener',
			injectAt: '#btn-obs',
			status: 'idle'
		});
		expect(events[2].meta).toEqual({
			componentName: undefined,
			listenerEvent: 'click',
			listenAt: '#btn-obs',
			alive: undefined,
			scope: undefined,
			timeout: undefined,
			withEvent: true
		});

		expect(events[3]).toMatchObject({
			name: 'register:duplicate',
			taskId: first.taskId,
			kind: 'listener',
			injectAt: '#btn-obs',
			status: 'idle',
			meta: {
				listenerEvent: 'click'
			}
		});
		expect(events[3].meta).toEqual({
			listenerEvent: 'click'
		});
	});

	it('should emit register:error with normalized payload', () => {
		const observer = new ObserverHub();
		const registerWithObserver = new TaskRegister(
			taskContext,
			{
				alive: false,
				scope: 'local',
				timeout: 5000,
				observer
			},
			createObserveEmitter(observer)
		);

		vi.spyOn(taskContext, 'set').mockImplementation((_k, _v) => {
			throw new Error('set error');
		});

		const events: ObserveEvent[] = [];
		observer.onAny((event) => {
			if (event.name.startsWith('register:')) {
				events.push(event);
			}
		});

		registerWithObserver.register('#obs', { name: 'ObsComp' });

		const errorEvent = events.find((event) => event.name === 'register:error');
		expect(errorEvent).toBeDefined();
		expect(errorEvent).toMatchObject({
			name: 'register:error',
			taskId: 'ObsComp@#obs',
			kind: 'component',
			injectAt: '#obs',
			status: 'idle',
			meta: {
				componentName: 'ObsComp'
			}
		});
		expect(errorEvent?.error).toBeInstanceOf(Error);
	});

	it('should emit register:error with listener identity payload', () => {
		const observer = new ObserverHub();
		const registerWithObserver = new TaskRegister(
			taskContext,
			{
				alive: false,
				scope: 'local',
				timeout: 5000,
				observer
			},
			createObserveEmitter(observer)
		);

		vi.spyOn(taskContext, 'set').mockImplementation((_k, _v) => {
			throw new Error('set error');
		});

		const events: ObserveEvent[] = [];
		observer.onAny((event) => {
			if (event.name.startsWith('register:')) {
				events.push(event);
			}
		});

		registerWithObserver.registerListener('#btn-obs', 'click', vi.fn());

		const errorEvent = events.find((event) => event.name === 'register:error');
		expect(errorEvent).toBeDefined();
		expect(errorEvent).toMatchObject({
			name: 'register:error',
			taskId: 'listener-#btn-obs-click',
			kind: 'listener',
			injectAt: '#btn-obs',
			status: 'idle',
			meta: {
				listenerEvent: 'click'
			}
		});
		expect(errorEvent?.error).toBeInstanceOf(Error);
	});
});
