import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState, useCallback } from 'react';
import { layoutAtom, canvasAtom, screenshotsAtom } from './atoms';

export function StashToolbar() {
  const [layout, setLayout] = useAtom(layoutAtom);
  const canvas = useAtomValue(canvasAtom);
  const setScreenshots = useSetAtom(screenshotsAtom);
  const [copyLabel, setCopyLabel] = useState('Copy Stash');

  const handleCopy = useCallback(() => {
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob! })]);
        setCopyLabel('Copied!');
        setTimeout(() => setCopyLabel('Copy Stash'), 1500);
      } catch (err) {
        alert('Copy failed: ' + (err as Error).message);
      }
    });
  }, [canvas]);

  const handleClear = useCallback(() => {
    setScreenshots(prev => {
      prev.forEach(s => URL.revokeObjectURL(s.url));
      return [];
    });
  }, [setScreenshots]);

  return (
    <div className="flex items-center gap-6 shrink-0">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="layout"
          value="vertical"
          checked={layout === 'vertical'}
          onChange={() => setLayout('vertical')}
          className="accent-blue-500"
        />
        <span>Vertical</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="layout"
          value="horizontal"
          checked={layout === 'horizontal'}
          onChange={() => setLayout('horizontal')}
          className="accent-blue-500"
        />
        <span>Horizontal</span>
      </label>
      <button
        onClick={handleCopy}
        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
      >
        {copyLabel}
      </button>
      <button
        onClick={handleClear}
        className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
