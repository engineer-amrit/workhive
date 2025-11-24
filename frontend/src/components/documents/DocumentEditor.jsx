import { ChevronLeft, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDocuments } from '../../hooks/useDocuments';

export default function DocumentEditor({ document, onBack }) {
  const { updateDocument } = useDocuments();
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateDocument(document._id, { title, content });
    setSaving(false);
    alert('Document saved!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-white font-bold text-xl bg-transparent border-none outline-none"
            />
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-screen bg-gray-800 text-white p-6 rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}