import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-gray-400 hover:text-white transition-colors"
      aria-label="Back"
    >
      ← Back
    </button>
  );
}
