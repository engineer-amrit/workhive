import React, { useState } from 'react';
import { 
  ChevronLeft, Plus, TrendingUp, CheckCircle, Circle, 
  MoreVertical, Edit3, Trash2, Target, BarChart3,
  Calendar, Bell, Star
} from 'lucide-react';

const HabitTrackerTemplate = ({ setView, onSave }) => {
  const [habits, setHabits] = useState([
    { 
      id: 1, 
      name: 'Morning Exercise', 
      description: '30 minutes of cardio and strength training',
      goal: 'Daily', 
      streak: 12, 
      totalCompletions: 45,
      bestStreak: 15,
      history: [1,1,1,1,0,1,1],
      category: 'Health',
      priority: 'high',
      reminder: '07:00',
      color: 'blue'
    },
    { 
      id: 2, 
      name: 'Read 30 minutes', 
      description: 'Personal development or fiction',
      goal: 'Daily', 
      streak: 8, 
      totalCompletions: 32,
      bestStreak: 12,
      history: [1,1,0,1,1,1,1],
      category: 'Learning',
      priority: 'medium',
      reminder: '21:00',
      color: 'green'
    }
  ]);

  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    goal: 'Daily',
    category: 'Health',
    priority: 'medium',
    reminder: '09:00'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [editingHabit, setEditingHabit] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const categories = ['Health', 'Learning', 'Work', 'Personal', 'Social'];
  const priorities = ['low', 'medium', 'high'];

  const toggleHabitCompletion = (habitId, dayIndex) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newHistory = [...habit.history];
        newHistory[dayIndex] = newHistory[dayIndex] ? 0 : 1;
        
        let newStreak = 0;
        for (let i = newHistory.length - 1; i >= 0; i--) {
          if (newHistory[i]) newStreak++;
          else break;
        }

        return {
          ...habit,
          history: newHistory,
          streak: newStreak,
          totalCompletions: newHistory.filter(Boolean).length,
          bestStreak: Math.max(habit.bestStreak, newStreak)
        };
      }
      return habit;
    }));
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit = {
      id: Date.now(),
      ...newHabit,
      streak: 0,
      totalCompletions: 0,
      bestStreak: 0,
      history: [0,0,0,0,0,0,0]
    };

    setHabits([...habits, habit]);
    setNewHabit({
      name: '',
      description: '',
      goal: 'Daily',
      category: 'Health',
      priority: 'medium',
      reminder: '09:00'
    });
    setShowAddForm(false);
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    setDropdownOpen(null);
  };

  const getCompletionRate = (habit) => {
    return Math.round((habit.totalCompletions / (habit.history.length * 4)) * 100);
  };

  const filteredHabits = habits.filter(habit => 
    activeTab === 'all' || habit.category === activeTab
  );

  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter(h => h.history[6]).length,
    totalCompletions: habits.reduce((sum, h) => sum + h.totalCompletions, 0),
    averageCompletion: Math.round(habits.reduce((sum, h) => sum + getCompletionRate(h), 0) / habits.length) || 0
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Habit Tracker</h1>
                  <p className="text-sm text-gray-600">Build better habits, one day at a time</p>
                </div>
              </div>
            </div>
            <button onClick={() => onSave({ habits })} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Save to workspace
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold">{stats.totalHabits}</p>
              </div>
              <Target className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold">{stats.completedToday}/{stats.totalHabits}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Completions</p>
                <p className="text-2xl font-bold">{stats.totalCompletions}</p>
              </div>
              <TrendingUp className="text-orange-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{stats.averageCompletion}%</p>
              </div>
              <Star className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        {/* Tabs and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'all' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              All Habits
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === category ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 w-fit"
          >
            <Plus size={16} />
            New Habit
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Habit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Morning Meditation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Describe your habit..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newHabit.priority}
                  onChange={(e) => setNewHabit({...newHabit, priority: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addHabit}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Create Habit
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Habits Grid */}
        <div className="space-y-6">
          {filteredHabits.map(habit => (
            <div key={habit.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{habit.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      habit.priority === 'high' ? 'bg-red-100 text-red-800' :
                      habit.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {habit.priority}
                    </span>
                  </div>
                  
                  {habit.description && (
                    <p className="text-gray-600 mb-3 text-sm">{habit.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {habit.goal}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bell size={14} />
                      {habit.reminder}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {habit.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-orange-600">
                      <TrendingUp size={18} />
                      <span className="text-xl font-bold">{habit.streak}</span>
                      <span className="text-sm">days</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Best: {habit.bestStreak} days</p>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(dropdownOpen === habit.id ? null : habit.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {dropdownOpen === habit.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                        <button 
                          onClick={() => setEditingHabit(habit)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteHabit(habit.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium">{getCompletionRate(habit)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${getCompletionRate(habit)}%` }}
                  ></div>
                </div>
              </div>

              {/* Week Grid */}
              <div className="grid grid-cols-7 gap-2">
                {habit.history.map((completed, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xs text-gray-500 mb-2">{weekDays[i]}</div>
                    <button
                      onClick={() => toggleHabitCompletion(habit.id, i)}
                      className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                        completed 
                          ? 'bg-green-100 hover:bg-green-200 border border-green-200' 
                          : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {completed ? 
                        <CheckCircle className="text-green-600" size={20} /> : 
                        <Circle className="text-gray-400" size={20} />
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHabits.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <Target className="mx-auto text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mt-4">No habits yet</h3>
            <p className="text-gray-600 mt-2">Create your first habit to start tracking your progress</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Create Your First Habit
            </button>
          </div>
        )}
      </div>

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

export default HabitTrackerTemplate;