import { X } from 'lucide-react';
import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';

export default function TaskModal({ onClose }) {
  const { addTask } = useTasks();
  const [taskText, setTaskText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    setLoading(true);
    const success = await addTask({ text: taskText, dueDate: 'Today' });
    setLoading(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">New Task</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !taskText.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
}