import { useAtom } from 'jotai';
import { screenshotsAtom } from './atoms';

export interface Screenshot {
  id: string;
  img: HTMLImageElement;
  url: string;
}

interface ScreenshotThumbnailsProps {}

export function ScreenshotThumbnails({}: ScreenshotThumbnailsProps) {
  const [screenshots, setScreenshots] = useAtom(screenshotsAtom);

  const removeScreenshot = (id: string) => {
    setScreenshots(prev => {
      const shot = prev.find(s => s.id === id);
      if (shot) URL.revokeObjectURL(shot.url);
      return prev.filter(s => s.id !== id);
    });
  };

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto shrink-0">
      {screenshots.map((shot, i) => (
        <div key={shot.id} className="relative shrink-0">
          <img
            src={shot.url}
            alt={`Screenshot ${i + 1}`}
            className="w-24 h-16 rounded object-cover border border-gray-600"
          />
          <button
            onClick={() => removeScreenshot(shot.id)}
            className="absolute top-0 right-0 w-5 h-5 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center text-white text-xs leading-none transition-colors"
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
