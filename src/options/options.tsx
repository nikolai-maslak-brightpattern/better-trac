import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { flushPendingOptionsPageTask } from '../pendingOptionsPageTask';
import { Menu } from './Menu';
import { ImageCombiner } from './image-combiner/ImageCombiner';
import { MdPreview } from './md-preview/MdPreview';
import './options.css';

function AppRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    const performPendingOptionsPageTask = () => {
      flushPendingOptionsPageTask().then((task) => {
        if (task) {
          navigate(task.page, { state: task.state });
        }
      });
    };

    performPendingOptionsPageTask();
    window.addEventListener('focus', performPendingOptionsPageTask);
    return () => window.removeEventListener('focus', performPendingOptionsPageTask);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/image-combiner" element={<ImageCombiner />} />
      <Route path="/md-preview" element={<MdPreview />} />
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemoryRouter>
      <AppRouter />
    </MemoryRouter>
  </StrictMode>
);
