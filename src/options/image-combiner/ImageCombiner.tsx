import { useCallback } from 'react';
import { usePasteScreenshot } from './hooks/usePasteScreenshot';
import { ScreenshotThumbnails } from './ScreenshotThumbnails';
import { CombinerToolbar } from './CombinerToolbar';
import { CombinerCanvas } from './CombinerCanvas';

export function ImageCombiner() {
  usePasteScreenshot();

  return (
    <div className="bg-gray-900 text-white h-screen p-6 flex flex-col gap-2">
      <p className="text-gray-500 text-sm">
        Press Ctrl+V / Cmd+V to paste a screenshot
      </p>
      <CombinerToolbar />
      <ScreenshotThumbnails />
      <CombinerCanvas />
    </div>
  );
}
