import type { ReactElement } from 'react';
import type { Root } from 'react-dom/client';
import type { ResolvableMountAdapter } from '../../core/adapter/types';

export type ReactMountArtifact = ReactElement;
export type ReactMountRoot = Root;

export type ReactMountAdapter = ResolvableMountAdapter<
	ReactMountArtifact,
	ReactMountRoot,
	undefined
>;
