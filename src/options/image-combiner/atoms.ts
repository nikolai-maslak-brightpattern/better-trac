import { atom } from 'jotai';
import type { Screenshot } from './ScreenshotThumbnails';

export type Layout = 'vertical' | 'horizontal';

export const screenshotsAtom = atom<Screenshot[]>([]);
export const layoutAtom = atom<Layout>('vertical');
export const canvasAtom = atom<HTMLCanvasElement | null>(null);
