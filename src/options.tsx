import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ImageCombiner } from './ImageCombiner';
import './options.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImageCombiner />
  </StrictMode>
);
