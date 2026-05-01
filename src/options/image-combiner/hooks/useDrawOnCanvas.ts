import { useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { canvasAtom, screenshotsAtom, strokesAtom, drawColorAtom, drawWidthAtom, type Stroke } from '../atoms';
import { useEvent } from '../../useEvent';

export function useDrawOnCanvas() {
  const canvas = useAtomValue(canvasAtom);
  const screenshots = useAtomValue(screenshotsAtom);
  const setStrokes = useSetAtom(strokesAtom);
  const drawColor = useAtomValue(drawColorAtom);
  const drawWidth = useAtomValue(drawWidthAtom);

  const isDrawing = useRef(false);
  const currentStroke = useRef<Stroke | null>(null);

  const getPoint = useEvent((e: MouseEvent) => {
    const rect = canvas!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas!.width / rect.width),
      y: (e.clientY - rect.top) * (canvas!.height / rect.height),
    };
  });

  const handleMouseDown = useEvent((e: MouseEvent) => {
    if (!canvas || !screenshots.length) return;
    const pt = getPoint(e);
    isDrawing.current = true;
    currentStroke.current = { color: drawColor, width: drawWidth, points: [pt] };
  });

  const handleMouseMove = useEvent((e: MouseEvent) => {
    if (!isDrawing.current || !canvas || !currentStroke.current) return;
    const points = currentStroke.current.points;
    const prevPt = points[points.length - 1];
    const pt = getPoint(e);
    points.push(pt);

    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(prevPt.x, prevPt.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = currentStroke.current.color;
    ctx.lineWidth = currentStroke.current.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  });

  const commitStroke = useEvent(() => {
    if (!isDrawing.current || !currentStroke.current) return;
    isDrawing.current = false;
    const stroke = currentStroke.current;
    currentStroke.current = null;
    if (stroke.points.length > 1) {
      setStrokes(prev => [...prev, stroke]);
    }
  });

  useEffect(() => {
    if (!canvas) return;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', commitStroke);
    window.addEventListener('mouseup', commitStroke);
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', commitStroke);
      window.removeEventListener('mouseup', commitStroke);
    };
  }, [canvas]);
}
