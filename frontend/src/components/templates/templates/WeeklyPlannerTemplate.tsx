import React, { useState } from 'react';
import { 
  ChevronLeft, Clock, Plus, MoreVertical, Edit3, Trash2, 
  Target, CheckCircle, Circle, Calendar, BarChart3,
  X, Save, Tag, User, Building
} from 'lucide-react';

const WeeklyPlannerTemplate = ({ setView, onSave }) => {
  const [weekSchedule, setWeekSchedule] = useState({
    Monday: [
      { 
        id: 1,
        time: '09:00', 
        task: 'Team standup meeting', 
        duration: '30min',
        description: 'Daily team sync and planning',
        category: 'Meeting',
        priority: 'high',
        completed: false,
        color: 'blue'
      },
      { 
        id: 2,
        time: '10:00', 
        task: 'Deep work - Project Alpha', 
        duration: '2hr',
        description: 'Focus on core feature development',
        category: 'Work',
        priority: 'high',
        completed: true,
        color: 'green'
      }
    ],
    Tuesday: [
      { 
        id: 3,
        time: '14:00', 
        task: 'Client presentation', 
        duration: '1hr',
        description: 'Quarterly review with key client',
        category: 'Meeting',
        priority: 'medium',
        completed: false,
        color: 'purple'
      }
    ],
    Wednesday: [
      { 
        id: 4,
        time: '09:00', 
        task: 'Design review session', 
        duration: '1hr',
        description: 'Review new UI/UX designs with team',
        category: 'Review',
        priority: 'medium',
        completed: false,
        color: 'orange'
      }
    ],
    Thursday: [],
    Friday: [
      { 
        id: 5,
        time: '15:00', 
        task: 'Sprint retrospective', 
        duration: '1hr',
        description: 'Team retrospective and planning',
        category: 'Meeting',
        priority: 'medium',
        completed: false,
        color: 'blue'
      }
    ],
    Saturday: [],
    Sunday: []
  });

  const [showAddForm, setShowAddForm] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [newTask, setNewTask] = useState({
    time: '09:00',
    task: '',
    duration: '30min',
    description: '',
    category: 'Work',
    priority: 'medium'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['Work', 'Meeting', 'Personal', 'Health', 'Learning', 'Review', 'Social'];
  const priorities = ['low', 'medium', 'high'];
  const durations = ['15min', '30min', '45min', '1hr', '1.5hr', '2hr', '3hr', '4hr+'];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-700',
      'Meeting': 'bg-purple-100 text-purple-700',
      'Personal': 'bg-green-100 text-green-700',
      'Health': 'bg-red-100 text-red-700',
      'Learning': 'bg-orange-100 text-orange-700',
      'Review': 'bg-indigo-100 text-indigo-700',
      'Social': 'bg-pink-100 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const addTask = (day) => {
    if (!newTask.task.trim()) return;

    const task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      color: 'blue'
    };

    setWeekSchedule(prev => ({
      ...prev,
      [day]: [...prev[day], task]
    }));

    setNewTask({
      time: '09:00',
      task: '',
      duration: '30min',
      description: '',
      category: 'Work',
      priority: 'medium'
    });
    setShowAddForm(null);
  };

  const deleteTask = (day, taskId) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(task => task.id !== taskId)
    }));
    setDropdownOpen(null);
  };

  const toggleTaskCompletion = (day, taskId) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: prev[day].map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    }));
  };

  const updateTask = (day, updatedTask) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: prev[day].map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
    setEditingTask(null);
  };

  const moveTask = (fromDay, toDay, taskId) => {
    const task = weekSchedule[fromDay].find(t => t.id === taskId);
    if (!task) return;

    setWeekSchedule(prev => ({
      ...prev,
      [fromDay]: prev[fromDay].filter(t => t.id !== taskId),
      [toDay]: [...prev[toDay], task]
    }));
    setDropdownOpen(null);
  };

  const getDayStats = (day) => {
    const tasks = weekSchedule[day];
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const totalDuration = tasks.reduce((sum, task) => {
      const duration = task.duration;
      if (duration.includes('hr')) {
        return sum + parseFloat(duration) * 60;
      }
      return sum + parseInt(duration);
    }, 0);
    
    return { total, completed, totalDuration };
  };

  const getWeekStats = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    let totalHours = 0;

    days.forEach(day => {
      const stats = getDayStats(day);
      totalTasks += stats.total;
      completedTasks += stats.completed;
      totalHours += stats.totalDuration;
    });

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalHours: (totalHours / 60).toFixed(1)
    };
  };

  const weekStats = getWeekStats();

  const TaskForm = ({ day, task = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState(task || newTask);

    const handleSubmit = () => {
      if (task) {
        onSave(day, { ...task, ...formData });
      } else {
        addTask(day);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{task ? 'Edit Task' : 'Add New Task'}</h3>
              <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={formData.task}
                  onChange={(e) => setFormData({...formData, task: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="What needs to be done?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Add details about this task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {task ? 'Update Task' : 'Add Task'}
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Weekly Planner</h1>
                  <p className="text-sm text-gray-600">Plan your week, achieve your goals</p>
                </div>
              </div>
            </div>
            <button onClick={() => onSave({ weekSchedule })} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Save to workspace
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Week Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{weekStats.totalTasks}</p>
              </div>
              <Target className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{weekStats.completedTasks}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{weekStats.completionRate}%</p>
              </div>
              <BarChart3 className="text-orange-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{weekStats.totalHours}h</p>
              </div>
              <Clock className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {days.map(day => {
            const dayStats = getDayStats(day);
            return (
              <div key={day} className="bg-white rounded-xl border border-gray-200 p-4 min-h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{day}</h3>
                    <p className="text-xs text-gray-500">
                      {dayStats.total} tasks • {dayStats.completed} completed
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(day)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  {weekSchedule[day]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        task.completed 
                          ? 'bg-gray-50 border-gray-200 opacity-75' 
                          : 'bg-white border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTaskCompletion(day, task.id)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle className="text-green-500" size={16} />
                            ) : (
                              <Circle className="text-gray-400" size={16} />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                {task.time}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            <p className={`text-sm font-medium ${
                              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}>
                              {task.task}
                            </p>
                            
                            {task.description && (
                              <p className="text-xs text-gray-600 mt-1 truncate">{task.description}</p>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(task.category)}`}>
                                {task.category}
                              </span>
                              <span className="text-xs text-gray-500">{task.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="relative flex-shrink-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === task.id ? null : task.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical size={14} />
                          </button>
                          
                          {dropdownOpen === task.id && (
                            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                              <button 
                                onClick={() => setEditingTask({ day, task })}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
                              >
                                <Edit3 size={12} />
                                Edit
                              </button>
                              {days.filter(d => d !== day).map(targetDay => (
                                <button 
                                  key={targetDay}
                                  onClick={() => moveTask(day, targetDay, task.id)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                  Move to {targetDay}
                                </button>
                              ))}
                              <button 
                                onClick={() => deleteTask(day, task.id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {weekSchedule[day].length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Calendar size={32} className="mx-auto mb-2" />
                      <p className="text-sm">No tasks scheduled</p>
                      <button
                        onClick={() => setShowAddForm(day)}
                        className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                      >
                        Add your first task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      {(showAddForm || editingTask) && (
        <TaskForm
          day={showAddForm || editingTask?.day}
          task={editingTask?.task}
          onSave={updateTask}
          onCancel={() => {
            setShowAddForm(null);
            setEditingTask(null);
          }}
        />
      )}

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setDropdownOpen(null)}
        />
      )}
    </div>
  );
};

export default WeeklyPlannerTemplate;