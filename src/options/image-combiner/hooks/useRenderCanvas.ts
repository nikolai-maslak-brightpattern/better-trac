import { useCallback, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { screenshotsAtom, layoutAtom, canvasAtom, strokesAtom, type Layout, type Stroke } from '../atoms';
import type { Screenshot } from '../ScreenshotThumbnails';

function replayStrokes(ctx: CanvasRenderingContext2D, strokes: Stroke[]) {
  for (const stroke of strokes) {
    if (stroke.points.length < 2) continue;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
  }
}

export function useRenderCanvas() {
  const [canvas, setCanvas] = useAtom(canvasAtom);
  const screenshots = useAtomValue(screenshotsAtom);
  const layout = useAtomValue(layoutAtom);
  const strokes = useAtomValue(strokesAtom);

  const renderCanvas = useCallback((shots: Screenshot[], currentLayout: Layout, currentStrokes: Stroke[]) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

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

    replayStrokes(ctx, currentStrokes);
  }, [canvas]);

  useEffect(() => {
    renderCanvas(screenshots, layout, strokes);
  }, [screenshots, layout, strokes, renderCanvas]);

  return useCallback((node: HTMLCanvasElement | null) => setCanvas(node), [setCanvas]);
}
