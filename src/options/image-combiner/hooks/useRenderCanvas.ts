import { useCallback, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { screenshotsAtom, layoutAtom, Layout, canvasAtom } from '../atoms';
import type { Screenshot } from '../ScreenshotThumbnails';

export function useRenderCanvas() {
  const [canvas, setCanvas] = useAtom(canvasAtom);
  const screenshots = useAtomValue(screenshotsAtom);
  const layout = useAtomValue(layoutAtom);

  const renderCanvas = useCallback((shots: Screenshot[], currentLayout: Layout) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;  // canvas is non-null here

    if (shots.length === 0) {
      canvas.width = 0;
      canvas.height = 0;
      return;
    }

    if (currentLayout === 'vertical') {
      const newW = Math.max(...shots.map(s => s.img.naturalWidth));
      const newH = shots.reduce((sum, s) => sum + s.img.naturalHeight, 0);
      canvas.width = newW;
      canvas.height = newH;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, newW, newH);
      let y = 0;
      for (const shot of shots) {
        ctx.drawImage(shot.img, 0, y);
        y += shot.img.naturalHeight;
      }
    } else {
      const newW = shots.reduce((sum, s) => sum + s.img.naturalWidth, 0);
      const newH = Math.max(...shots.map(s => s.img.naturalHeight));
      canvas.width = newW;
      canvas.height = newH;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, newW, newH);
      let x = 0;
      for (const shot of shots) {
        ctx.drawImage(shot.img, x, 0);
        x += shot.img.naturalWidth;
      }
    }
  }, [canvas]);

  useEffect(() => {
    renderCanvas(screenshots, layout);
  }, [screenshots, layout, renderCanvas]);

  return useCallback((node: HTMLCanvasElement | null) => setCanvas(node), [setCanvas]);
}
