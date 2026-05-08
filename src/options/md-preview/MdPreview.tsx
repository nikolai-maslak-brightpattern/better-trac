import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BackButton } from '../BackButton';

export function MdPreview() {
  const location = useLocation();
  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (location.state) setText(location.state);
  }, [location.key]);

  return (
    <div className="p-6 gap-2">
      <BackButton />
      <div className='flex flex-col gap-4'>
        <textarea
          className="w-full h-20 p-2 bg-zinc-800 text-white rounded font-mono text-sm resize-y"
          placeholder="Paste markdown here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="prose prose-invert max-w-none">
          <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
        </div>
      </div>
    </div>
  );
}
