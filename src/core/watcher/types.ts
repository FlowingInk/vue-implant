export type InjectCallback = (el: HTMLElement, observer?: MutationObserver) => void;

export type ObserverOptions =
	| { once: boolean; timeout?: number }
	| { once?: boolean; timeout: number };
