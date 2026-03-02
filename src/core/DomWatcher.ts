import type { InjectCallback, ObserverOptions } from '../type';

/* TODO: Consider timeout-based destruction. Although the timeout parameter is already provided,
 there should be a mechanism to destroy observers when the target DOM will never appear, to avoid performance overhead.*/
export class DOMWatcher {
	/**
	 * Observe the DOM for elements matching the given selector
	 */
	public onDomReady(
		selector: string,
		callback: InjectCallback,
		root: Document | HTMLElement = document,
		options: ObserverOptions
	): void {
		const observers: MutationObserver[] = [];
		let isDisconnected = false;

		const disconnect = () => {
			if (isDisconnected) return;
			isDisconnected = true;

			for (const obs of observers) {
				obs.disconnect();
			}
			observers.length = 0;
		};

		const wrappedCallback = (el: HTMLElement, observer?: MutationObserver) => {
			callback(el, observer);

			// In once mode, disconnect immediately after finding the element
			if (options?.once) {
				disconnect();
				console.log('[DOMWatcher] Element found, observer disconnected (once mode).');
			}
		};

		const startObserve = (currentRoot: Document | HTMLElement) => {
			if (isDisconnected) return; // Do not observe if already disconnected
			this.checkExistingElement(currentRoot, selector, wrappedCallback);
			if (isDisconnected) return; // In once mode, skip observer setup if element exists
			this.setupMutationObserver(currentRoot, selector, observers, wrappedCallback);
		};

		// Start the main flow
		startObserve(root);

		// Set timeout for auto-disconnect
		if (options?.timeout) {
			setTimeout(() => {
				disconnect();
			}, options.timeout);
		}
	}
	/**
	 *  public api for observing dom is alive, which mean the target element may accident be removed,
	 *  so we need a method to observing the target element is removed and re-added,
	 *  then we can re-inject the component into the target element
	 */
	public onDomAlive(
		target: HTMLElement, //observer the target element's parent element
		selector: string, // the selector to find the target element when it is re-added
		onRemove: () => void, // this callback is clear the injected component instance and subapp 
		onRestore: InjectCallback, // callback when the target element is re-added
	): void {
		const warpperCallback = () => {

		}
		const observer: MutationObserver | null = this.setupRemovalObserver(target, onRemove);
		// if the observer is null, it mean that the target's parent element not found 
		if (!observer) {
			this.onDomReady(selector, onRestore, target.ownerDocument, { once: true });
		}
	}

	/**
	 * Check if the target element already exists in the current scope
	 */
	private checkExistingElement(
		currentRoot: Document | HTMLElement,
		selector: string,
		callback: (el: HTMLElement, observer?: MutationObserver) => void
	) {
		const searchRoot =
			currentRoot instanceof Document ? currentRoot : currentRoot.ownerDocument;
		const existing = searchRoot.querySelector(selector);

		if (existing) {
			callback(existing as HTMLElement, undefined);
		}
	}

	/**
	 * Set up a MutationObserver to watch for DOM changes
	 */
	private setupMutationObserver(
		currentRoot: Document | HTMLElement,
		selector: string,
		observers: MutationObserver[],
		callback: InjectCallback
	) {
		const observer: MutationObserver = new MutationObserver((mutations, obs) => {
			for (const mutation of mutations) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						this.handleAddedNode(node as Element, selector, obs, callback);
					}
				});
			}
		});

		const observeTarget: Element | null = this.getObserveTarget(currentRoot);
		if (observeTarget) {
			observer.observe(observeTarget, {
				childList: true,
				subtree: true
			});
			observers.push(observer);
		}
	}

	private setupRemovalObserver(target: HTMLElement, onRemove: () => void): MutationObserver | null {

		const parentNode: ParentNode | null = target.parentNode;

		if (!parentNode) {
			onRemove();
			return null;
		}


		const observer = new MutationObserver((mutations, obs) => {
			for (const mutation of mutations) {
				mutation.removedNodes.forEach((node) => {
					if (node === target) {
						onRemove();
						obs.disconnect();
					}
				});
			}
		});

		observer.observe(parentNode, { childList: true });
		return observer;
	}

	/**
	 * Handle newly added nodes
	 */
	private handleAddedNode(
		node: Element,
		selector: string,
		observer: MutationObserver,
		callback: InjectCallback
	) {
		const target = node.matches(selector) ? node : node.querySelector(selector);
		if (target) {
			callback(target as HTMLElement, observer);
		}
	}

	/**
	 * Get the observation target element
	 */
	private getObserveTarget(currentRoot: Document | HTMLElement): HTMLElement | null {
		return (currentRoot instanceof Document ? currentRoot.body : currentRoot) || document.body;
	}
}
