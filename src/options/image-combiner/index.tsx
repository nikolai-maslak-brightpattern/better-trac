import { useCallback } from 'react';
import { usePasteScreenshot } from './hooks/usePasteScreenshot';
import { useRenderCanvas } from './hooks/useRenderCanvas';
import { ScreenshotThumbnails } from './ScreenshotThumbnails';
import { CombinerToolbar } from './CombinerToolbar';

export function ImageCombiner() {
  const canvasCallbackRef = useRenderCanvas();

  usePasteScreenshot();

  return (
    <div className="bg-gray-900 text-white h-screen p-6 flex flex-col gap-2">
      <p className="text-gray-500 text-sm">Press Ctrl+V / Cmd+V to paste a screenshot</p>
      <CombinerToolbar />
      <ScreenshotThumbnails />

      <div className="border border-gray-700 rounded flex-auto overflow-hidden">
        <canvas ref={canvasCallbackRef} className="block max-w-full max-h-full w-auto h-auto" />
      </div>
    </div>
  );
}
