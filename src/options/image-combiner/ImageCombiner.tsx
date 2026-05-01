import { usePasteScreenshot } from './hooks/usePasteScreenshot';
import { ScreenshotThumbnails } from './ScreenshotThumbnails';
import { CombinerToolbar } from './CombinerToolbar';
import { CombinerCanvas } from './CombinerCanvas';
import { BackButton } from '../BackButton';

export function ImageCombiner() {
  usePasteScreenshot();

  return (
    <div className="bg-gray-900 text-white h-screen p-6 flex flex-col gap-2">
      <div className="flex items-center gap-3 shrink-0">
        <BackButton />
        <span className="text-gray-600">|</span>
        <span className="font-medium">Image Combiner</span>
      </div>
      <p className="text-gray-500 text-sm">
        Press Ctrl+V / Cmd+V to paste a screenshot
      </p>
      <CombinerToolbar />
      <ScreenshotThumbnails />
      <CombinerCanvas />
    </div>
  );
}
