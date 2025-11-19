import { X } from 'lucide-react';
import { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';

export default function DocumentModal({ onClose, onSuccess }) {
  const { addDocument } = useDocuments();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const document = await addDocument({ title, content: '' });
    setLoading(false);

    if (document) {
      onSuccess(document);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">New Document</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4 outline-none focus:ring-2 focus:ring-green-500"
            autoFocus
          />
          <button 
            type="submit" 
            disabled={loading || !title.trim()}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Document'}
          </button>
        </form>
      </div>
    </div>
  );
}