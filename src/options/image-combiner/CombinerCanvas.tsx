import { useAtomValue } from 'jotai';
import { useRenderCanvas } from './hooks/useRenderCanvas';
import { useDrawOnCanvas } from './hooks/useDrawOnCanvas';
import { screenshotsAtom } from './atoms';

export function CombinerCanvas() {
  const canvasCallbackRef = useRenderCanvas();
  const screenshots = useAtomValue(screenshotsAtom);
  useDrawOnCanvas();

  return (
    <div className="border border-gray-700 rounded flex-auto overflow-hidden">
      <canvas
        ref={canvasCallbackRef}
        className={`block max-w-full max-h-full w-auto h-auto${screenshots.length ? ' cursor-crosshair' : ''}`}
      />
    </div>
  );
}
