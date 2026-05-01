import { useNavigate } from 'react-router-dom';

const apps = [
  {
    path: '/image-combiner',
    title: 'Image Combiner',
    description: 'Paste, arrange, and combine screenshots into one image',
  },
];

export function Menu() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-xl font-semibold mb-6">Better Trac</h1>
      <div className="grid grid-cols-2 gap-4">
        {apps.map(app => (
          <button
            key={app.path}
            onClick={() => navigate(app.path)}
            className="text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="font-medium mb-1">{app.title}</div>
            <div className="text-sm text-gray-400">{app.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
