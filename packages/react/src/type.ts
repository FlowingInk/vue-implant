import type { ReactElement } from 'react';
import type { Root } from 'react-dom/client';
import type { ResolvableMountAdapter } from '@vue-implant/core';

export type ReactMountArtifact = ReactElement;
export type ReactMountRoot = Root;

export type ReactMountAdapter = ResolvableMountAdapter<
	ReactMountArtifact,
	ReactMountRoot,
	undefined
>;
