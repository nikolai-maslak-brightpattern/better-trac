import { useCallback, useEffect, useRef, useState } from 'react';

type Layout = 'vertical' | 'horizontal';

export function PictureStash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasContentRef = useRef(false);
  const [layout, setLayout] = useState<Layout>('vertical');
  const [copyLabel, setCopyLabel] = useState('Copy Stash');

  const addImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    if (!hasContentRef.current) {
      canvas.width = iw;
      canvas.height = ih;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, iw, ih);
      ctx.drawImage(img, 0, 0);
      hasContentRef.current = true;
      return;
    }

    const snap = document.createElement('canvas');
    snap.width = canvas.width;
    snap.height = canvas.height;
    snap.getContext('2d')!.drawImage(canvas, 0, 0);

    if (layout === 'vertical') {
      const newW = Math.max(canvas.width, iw);
      const newH = canvas.height + ih;
      canvas.width = newW;
      canvas.height = newH;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, newW, newH);
      ctx.drawImage(snap, 0, 0);
      ctx.drawImage(img, 0, snap.height);
    } else {
      const newW = canvas.width + iw;
      const newH = Math.max(canvas.height, ih);
      canvas.width = newW;
      canvas.height = newH;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, newW, newH);
      ctx.drawImage(snap, 0, 0);
      ctx.drawImage(img, snap.width, 0);
    }
  }, [layout]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items ?? [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile()!;
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => { addImage(img); URL.revokeObjectURL(url); };
        img.src = url;
        break;
      }
    }
  }, [addImage]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const handleCopy = useCallback(() => {
    const canvas = canvasRef.current!;
    if (!hasContentRef.current) return;
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob! })]);
        setCopyLabel('Copied!');
        setTimeout(() => setCopyLabel('Copy Stash'), 1500);
      } catch (err) {
        alert('Copy failed: ' + (err as Error).message);
      }
    });
  }, []);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current!;
    canvas.width = 0;
    canvas.height = 0;
    hasContentRef.current = false;
  }, []);

  return (
    <div
      className="bg-gray-900 text-white min-h-screen"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-5">Picture Stash</h1>

        <div className="flex items-center gap-6 mb-3">
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

        <p className="text-gray-500 text-sm mb-4">Press Ctrl+V / Cmd+V to paste a screenshot</p>

        <div className="border border-gray-700 rounded overflow-auto bg-black" style={{ maxHeight: '75vh' }}>
          <canvas ref={canvasRef} className="block" />
        </div>
      </div>
    </div>
  );
}
