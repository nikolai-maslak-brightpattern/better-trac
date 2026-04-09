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

  const moveScreenshot = (id: string, direction: -1 | 1) => {
    setScreenshots(prev => {
      const index = prev.findIndex(s => s.id === id);
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
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
            className="absolute top-0 right-0 w-5 h-5 rounded-full bg-black/70 hover:bg-red-600 flex items-center justify-center text-white text-xs leading-none transition-colors cursor-pointer"
            aria-label="Remove"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-0.5">
            <button
              onClick={() => moveScreenshot(shot.id, -1)}
              disabled={i === 0}
              className="w-5 h-5 rounded bg-black/70 hover:bg-black disabled:opacity-0 flex items-center justify-center text-white text-xs transition-colors cursor-pointer"
              aria-label="Move left"
            >
              ‹
            </button>
            <button
              onClick={() => moveScreenshot(shot.id, 1)}
              disabled={i === screenshots.length - 1}
              className="w-5 h-5 rounded bg-black/70 hover:bg-black disabled:opacity-0 flex items-center justify-center text-white text-xs transition-colors cursor-pointer"
              aria-label="Move right"
            >
              ›
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
