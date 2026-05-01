import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Menu } from './Menu';
import { ImageCombiner } from './image-combiner/ImageCombiner';
import './options.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/image-combiner" element={<ImageCombiner />} />
      </Routes>
    </MemoryRouter>
  </StrictMode>
);
