import { useRenderCanvas } from './hooks/useRenderCanvas';

export function CombinerCanvas() {
  const canvasCallbackRef = useRenderCanvas();

  return (
    <div className="border border-gray-700 rounded flex-auto overflow-hidden">
      <canvas ref={canvasCallbackRef} className="block max-w-full max-h-full w-auto h-auto" />
    </div>
  );
}
