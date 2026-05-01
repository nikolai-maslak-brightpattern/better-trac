import { useAtom, useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import { layoutAtom, canvasAtom, screenshotsAtom, strokesAtom, drawColorAtom, drawWidthAtom } from './atoms';
import { useEvent } from '../useEvent';

export function CombinerToolbar() {
  const [layout, setLayout] = useAtom(layoutAtom);
  const canvas = useAtomValue(canvasAtom);
  const [screenshots, setScreenshots] = useAtom(screenshotsAtom);
  const [strokes, setStrokes] = useAtom(strokesAtom);
  const [drawColor, setDrawColor] = useAtom(drawColorAtom);
  const [drawWidth, setDrawWidth] = useAtom(drawWidthAtom);
  const [copyLabel, setCopyLabel] = useState('Copy');

  const handleCopy = useEvent(() => {
    if (!screenshots.length || !canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopyLabel('Copied!');
        setTimeout(() => setCopyLabel('Copy'), 1500);
      } catch (err) {
        alert('Copy failed: ' + (err as Error).message);
      }
    });
  });

  const handleUndo = useEvent(() => {
    setStrokes(prev => prev.slice(0, -1));
  });

  const handleClear = useEvent(() => {
    setScreenshots(prev => {
      prev.forEach(s => URL.revokeObjectURL(s.url));
      return [];
    });
    setStrokes([]);
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') handleCopy();
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex items-center gap-4 shrink-0 flex-wrap">
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="layout" value="vertical" checked={layout === 'vertical'} onChange={() => setLayout('vertical')} className="accent-blue-500" />
        <span>Vertical</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="layout" value="horizontal" checked={layout === 'horizontal'} onChange={() => setLayout('horizontal')} className="accent-blue-500" />
        <span>Horizontal</span>
      </label>

      <span className="text-gray-600">|</span>

      <label className="flex items-center gap-2 cursor-pointer">
        <span className="text-sm text-gray-400">Color</span>
        <input
          type="color"
          value={drawColor}
          onChange={e => setDrawColor(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
        />
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <span className="text-sm text-gray-400">Width</span>
        <input
          type="range"
          min="1"
          max="20"
          value={drawWidth}
          onChange={e => setDrawWidth(Number(e.target.value))}
          className="w-20 accent-blue-500"
        />
        <span className="text-sm w-4 text-gray-300">{drawWidth}</span>
      </label>

      <span className="text-gray-600">|</span>

      <button
        onClick={handleUndo}
        disabled={!strokes.length}
        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        Undo
      </button>
      <button
        onClick={handleCopy}
        disabled={!screenshots.length}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {copyLabel}
      </button>
      <button
        onClick={handleClear}
        disabled={!screenshots.length}
        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        Clear
      </button>
    </div>
  );
}
