import { atom } from 'jotai';
import type { Screenshot } from './ScreenshotThumbnails';

export type Layout = 'vertical' | 'horizontal';

export interface Stroke {
  color: string;
  width: number;
  points: { x: number; y: number }[];
}

export const screenshotsAtom = atom<Screenshot[]>([]);
export const layoutAtom = atom<Layout>('vertical');
export const canvasAtom = atom<HTMLCanvasElement | null>(null);
export const strokesAtom = atom<Stroke[]>([]);
export const drawColorAtom = atom<string>('#ff0000');
export const drawWidthAtom = atom<number>(3);
