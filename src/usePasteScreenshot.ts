import { useCallback, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { screenshotsAtom } from './atoms';

export function usePasteScreenshot() {
  const setScreenshots = useSetAtom(screenshotsAtom);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items ?? [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile()!;
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          setScreenshots(prev => [...prev, { id: crypto.randomUUID(), img, url }]);
        };
        img.src = url;
        break;
      }
    }
  }, [setScreenshots]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);
}
