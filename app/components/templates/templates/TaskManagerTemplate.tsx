import React, { useState } from 'react';
import { ChevronLeft, Plus, Check, Calendar as CalendarIcon, LayoutList, LayoutGrid, Filter, Search, MoreVertical, Circle, CheckCircle2 } from 'lucide-react';

const TaskManagerTemplate = ({ setView, onSave }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'board', 'calendar'
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design new landing page', status: 'To Do', priority: 'High', assignee: 'You', dueDate: '2025-11-20', tags: ['Design', 'Web'] },
    { id: 2, title: 'Fix bug in authentication', status: 'In Progress', priority: 'High', assignee: 'You', dueDate: '2025-11-15', tags: ['Bug', 'Backend'] },
    { id: 3, title: 'Write documentation', status: 'In Progress', priority: 'Medium', assignee: 'You', dueDate: '2025-11-18', tags: ['Docs'] },
    { id: 4, title: 'Review pull requests', status: 'To Do', priority: 'Medium', assignee: 'You', dueDate: '2025-11-14', tags: ['Review'] },
    { id: 5, title: 'Update dependencies', status: 'Done', priority: 'Low', assignee: 'You', dueDate: '2025-11-10', tags: ['Maintenance'] },
    { id: 6, title: 'Plan sprint meeting', status: 'Done', priority: 'Medium', assignee: 'You', dueDate: '2025-11-11', tags: ['Meeting'] }
  ]);

  const [newTask, setNewTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = ['To Do', 'In Progress', 'Done'];
  const priorities = ['Low', 'Medium', 'High'];

  const addTask = (status = 'To Do') => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTask,
        status,
        priority: 'Medium',
        assignee: 'You',
        dueDate: new Date().toISOString().split('T')[0],
        tags: []
      }]);
      setNewTask('');
      setShowTaskInput(false);
    }
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status } : task
    ));
  };

  const updateTaskPriority = (id, priority) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 text-gray-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Done': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const renderListView = () => (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
        <div className="col-span-5">Task</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-gray-100">
        {showTaskInput && (
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-blue-50">
            <div className="col-span-5">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Task name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="col-span-7 flex items-center gap-2">
              <button
                onClick={() => addTask()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowTaskInput(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {filteredTasks.map(task => (
          <div key={task.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
            <div className="col-span-5 flex items-center gap-3">
              <button onClick={() => updateTaskStatus(task.id, task.status === 'Done' ? 'To Do' : 'Done')}>
                {task.status === 'Done' ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <Circle size={20} className="text-gray-400" />
                )}
              </button>
              <span className={`text-sm font-medium ${task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {task.title}
              </span>
            </div>
            <div className="col-span-2 flex items-center">
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                className={`text-xs px-2 py-1 rounded-lg border-0 font-medium ${getStatusColor(task.status)}`}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-center">
              <select
                value={task.priority}
                onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                className={`text-xs px-2 py-1 rounded-lg border font-medium ${getPriorityColor(task.priority)}`}
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-sm text-gray-600">{task.dueDate}</span>
            </div>
            <div className="col-span-1 flex items-center">
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-50 p-1 rounded transition-all text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Check size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No tasks found</p>
        </div>
      )}
    </div>
  );

  const renderBoardView = () => (
    <div className="grid grid-cols-3 gap-6">
      {statuses.map(status => (
        <div key={status} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{status}</h3>
            <span className="text-sm text-gray-500">
              {filteredTasks.filter(t => t.status === status).length}
            </span>
          </div>
          
          <div className="space-y-3">
            {filteredTasks.filter(task => task.status === status).map(task => (
              <div
                key={task.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                draggable
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 flex-1">{task.title}</p>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs transition-all"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500">{task.dueDate}</span>
                </div>
              </div>
            ))}
            
            {status === 'To Do' && (
              <button
                onClick={() => setShowTaskInput(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add task
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                  ✅
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">Task Manager</h1>
              </div>
            </div>
            
            <button 
              onClick={() => onSave({ tasks })}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save to workspace
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutList size={18} />
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'board' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* Filters */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {viewMode === 'list' && !showTaskInput && (
              <button
                onClick={() => setShowTaskInput(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                New Task
              </button>
            )}
          </div>
        </div>

        {/* Views */}
        {viewMode === 'list' && renderListView()}
        {viewMode === 'board' && renderBoardView()}
      </div>
    </div>
  );
};

export default TaskManagerTemplate;