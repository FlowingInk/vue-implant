import { isValidElement } from 'react';
import type { ReactMountArtifact } from './type';

export function isReactElement(artifact: unknown): artifact is ReactMountArtifact {
	return isValidElement(artifact);
}
