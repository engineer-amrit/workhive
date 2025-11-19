import React, { useState } from 'react';
import { ChevronLeft, Home, Plus, Check, Circle, Star, Calendar, Clock, Target, BookOpen, ListTodo, FileText, Trash2, Edit2, ChevronRight, Sun, Moon, Coffee, Zap, TrendingUp, Award, Heart, Brain, MessageSquare, Image as ImageIcon, Link as LinkIcon, Flag, Archive, MoreVertical, X, Save, Search, Filter, SortAsc, Eye, EyeOff, Dumbbell, Droplet, Utensils, DollarSign } from 'lucide-react';

const PersonalHomeTemplate = ({ setView, onSave }) => {
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const [activeView, setActiveView] = useState('today'); // today, week, tasks, notes, goals, journal
  
  // Tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review project proposal', completed: false, priority: 'high', due: today, category: 'Work', timeEstimate: '1h', project: 'Q4 Planning' },
    { id: 2, title: 'Call dentist for appointment', completed: false, priority: 'medium', due: today, category: 'Personal', timeEstimate: '15m', project: null },
    { id: 3, title: 'Finish presentation slides', completed: false, priority: 'high', due: today, category: 'Work', timeEstimate: '2h', project: 'Client Meeting' },
    { id: 4, title: 'Buy groceries', completed: false, priority: 'low', due: today, category: 'Personal', timeEstimate: '1h', project: null },
    { id: 5, title: 'Update team on progress', completed: true, priority: 'medium', due: today, category: 'Work', timeEstimate: '30m', project: 'Sprint Review' }
  ]);

  // Quick Notes
  const [notes, setNotes] = useState([
    { id: 1, title: 'Meeting Notes - Client Discussion', content: 'Key points from today\'s meeting:\n- Budget approval pending\n- Timeline extended to Dec 15\n- Need to revise scope document', date: today, category: 'Work', pinned: true },
    { id: 2, title: 'Book Recommendations', content: 'To read:\n- Atomic Habits\n- Deep Work\n- The 4-Hour Work Week', date: '2025-11-10', category: 'Personal', pinned: false },
    { id: 3, title: 'Recipe Ideas', content: 'Try this week:\n- Chicken stir-fry\n- Quinoa salad\n- Homemade pizza', date: '2025-11-09', category: 'Personal', pinned: false }
  ]);

  // Goals
  const [goals, setGoals] = useState([
    { id: 1, title: 'Launch new product feature', status: 'in-progress', deadline: '2025-12-01', progress: 65, category: 'Work', milestones: ['Design complete', 'Development 70%', 'Testing pending'] },
    { id: 2, title: 'Read 12 books this year', status: 'in-progress', deadline: '2025-12-31', progress: 75, category: 'Personal', milestones: ['9 books completed', '3 remaining'] },
    { id: 3, title: 'Save $10,000 emergency fund', status: 'in-progress', deadline: '2025-12-31', progress: 45, category: 'Finance', milestones: ['$4,500 saved', '$5,500 to go'] }
  ]);

  // Journal Entries
  const [journalEntries, setJournalEntries] = useState([
    { id: 1, date: today, mood: 'great', gratitude: 'Had a productive day at work', highlight: 'Finished the presentation ahead of schedule', reflection: 'Feeling confident about the client meeting tomorrow' },
    { id: 2, date: '2025-11-11', mood: 'good', gratitude: 'Spent quality time with family', highlight: 'Went for a long walk in the park', reflection: 'Need to prioritize self-care more' }
  ]);

  // Habits
  const [habits, setHabits] = useState([
    { id: 1, title: 'Morning workout', streak: 12, completedToday: false, icon: 'Dumbbell', color: 'green' },
    { id: 2, title: 'Read 30 minutes', streak: 8, completedToday: true, icon: 'Book', color: 'blue' },
    { id: 3, title: 'Meditate', streak: 5, completedToday: false, icon: 'Brain', color: 'purple' },
    { id: 4, title: 'Drink 8 glasses water', streak: 15, completedToday: false, icon: 'Droplet', color: 'cyan' }
  ]);

  // Time blocks for today
  const [timeBlocks, setTimeBlocks] = useState([
    { id: 1, time: '09:00', duration: '1h', title: 'Team standup', type: 'meeting', color: 'blue' },
    { id: 2, time: '10:00', duration: '2h', title: 'Deep work - Presentation', type: 'focus', color: 'purple' },
    { id: 3, time: '14:00', duration: '1h', title: 'Client call', type: 'meeting', color: 'blue' },
    { id: 4, time: '15:30', duration: '1h', title: 'Exercise', type: 'personal', color: 'green' }
  ]);

  // Quick capture input
  const [quickCapture, setQuickCapture] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewNote, setShowNewNote] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [showNewTimeBlock, setShowNewTimeBlock] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    due: today,
    category: 'Work',
    timeEstimate: '30m',
    project: ''
  });

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'Personal'
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    deadline: '',
    category: 'Personal'
  });

  const [newJournalEntry, setNewJournalEntry] = useState({
    mood: 'good',
    gratitude: '',
    highlight: '',
    reflection: ''
  });

  const [newHabit, setNewHabit] = useState({
    title: '',
    icon: 'Target',
    color: 'blue'
  });

  const [newTimeBlock, setNewTimeBlock] = useState({
    time: '09:00',
    duration: '1h',
    title: '',
    type: 'focus',
    color: 'purple'
  });

  // Get greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: <Sun size={24} /> };
    if (hour < 18) return { text: 'Good Afternoon', icon: <Sun size={24} /> };
    return { text: 'Good Evening', icon: <Moon size={24} /> };
  };

  // Task functions
  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        ...newTask,
        completed: false
      }]);
      setNewTask({
        title: '',
        priority: 'medium',
        due: today,
        category: 'Work',
        timeEstimate: '30m',
        project: ''
      });
      setShowNewTask(false);
    }
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  // Note functions
  const addNote = () => {
    if (newNote.title.trim()) {
      setNotes([...notes, {
        id: Date.now(),
        ...newNote,
        date: today,
        pinned: false
      }]);
      setNewNote({
        title: '',
        content: '',
        category: 'Personal'
      });
      setShowNewNote(false);
    }
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    setEditingNote(null);
  };

  const deleteNote = (noteId) => {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter(n => n.id !== noteId));
    }
  };

  const togglePinNote = (noteId) => {
    setNotes(notes.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n));
  };

  // Goal functions
  const addGoal = () => {
    if (newGoal.title.trim()) {
      setGoals([...goals, {
        id: Date.now(),
        ...newGoal,
        status: 'in-progress',
        progress: 0,
        milestones: []
      }]);
      setNewGoal({
        title: '',
        deadline: '',
        category: 'Personal'
      });
      setShowNewGoal(false);
    }
  };

  const updateGoalProgress = (goalId, progress) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, progress } : g));
  };

  // Habit functions
  const toggleHabit = (habitId) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newCompleted = !h.completedToday;
        return {
          ...h,
          completedToday: newCompleted,
          streak: newCompleted ? h.streak + 1 : h.streak
        };
      }
      return h;
    }));
  };

  const addHabit = () => {
    if (newHabit.title.trim()) {
      setHabits([...habits, {
        id: Date.now(),
        title: newHabit.title,
        icon: newHabit.icon,
        color: newHabit.color,
        streak: 0,
        completedToday: false
      }]);
      setNewHabit({
        title: '',
        icon: 'Target',
        color: 'blue'
      });
      setShowNewHabit(false);
    }
  };

  const deleteHabit = (habitId) => {
    if (window.confirm('Delete this habit?')) {
      setHabits(habits.filter(h => h.id !== habitId));
    }
  };

  // Time block functions
  const addTimeBlock = () => {
    if (newTimeBlock.title.trim()) {
      setTimeBlocks([...timeBlocks, {
        id: Date.now(),
        time: newTimeBlock.time,
        duration: newTimeBlock.duration,
        title: newTimeBlock.title,
        type: newTimeBlock.type,
        color: newTimeBlock.color
      }]);
      setNewTimeBlock({
        time: '09:00',
        duration: '1h',
        title: '',
        type: 'focus',
        color: 'purple'
      });
      setShowNewTimeBlock(false);
    }
  };

  const deleteTimeBlock = (blockId) => {
    if (window.confirm('Delete this time block?')) {
      setTimeBlocks(timeBlocks.filter(b => b.id !== blockId));
    }
  };

  // Journal function
  const addJournalEntry = () => {
    if (newJournalEntry.gratitude || newJournalEntry.highlight) {
      setJournalEntries([{
        id: Date.now(),
        date: today,
        ...newJournalEntry
      }, ...journalEntries]);
      setNewJournalEntry({
        mood: 'good',
        gratitude: '',
        highlight: '',
        reflection: ''
      });
      setShowJournal(false);
    }
  };

  // Quick capture
  const handleQuickCapture = () => {
    if (quickCapture.trim()) {
      // Auto-detect if it's a task or note
      if (quickCapture.toLowerCase().includes('todo') || quickCapture.toLowerCase().includes('task')) {
        setTasks([...tasks, {
          id: Date.now(),
          title: quickCapture,
          completed: false,
          priority: 'medium',
          due: today,
          category: 'Inbox',
          timeEstimate: '30m',
          project: null
        }]);
      } else {
        setNotes([...notes, {
          id: Date.now(),
          title: 'Quick Note',
          content: quickCapture,
          date: today,
          category: 'Inbox',
          pinned: false
        }]);
      }
      setQuickCapture('');
    }
  };

  // Stats
  const todaysTasks = tasks.filter(t => t.due === today);
  const completedTasks = todaysTasks.filter(t => t.completed).length;
  const totalTodayTasks = todaysTasks.length;
  const completionRate = totalTodayTasks > 0 ? (completedTasks / totalTodayTasks * 100).toFixed(0) : 0;
  const habitsCompletedToday = habits.filter(h => h.completedToday).length;
  const totalActiveGoals = goals.filter(g => g.status === 'in-progress').length;

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
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
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Home size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Personal Home</h1>
                  <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onSave({ tasks, notes, goals, journalEntries, habits, timeBlocks })}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Save
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto">
            {[
              { id: 'today', label: 'Today', icon: <Calendar size={16} /> },
              { id: 'tasks', label: 'Tasks', icon: <ListTodo size={16} /> },
              { id: 'notes', label: 'Notes', icon: <FileText size={16} /> },
              { id: 'goals', label: 'Goals', icon: <Target size={16} /> },
              { id: 'journal', label: 'Journal', icon: <BookOpen size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeView === tab.id
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Capture Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-yellow-500" />
            <input
              type="text"
              value={quickCapture}
              onChange={(e) => setQuickCapture(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickCapture()}
              placeholder="Quick capture: Press Enter to add task or note..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleQuickCapture}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Capture
            </button>
          </div>
        </div>

        {/* TODAY VIEW */}
        {activeView === 'today' && (
          <div className="space-y-6">
            {/* Greeting Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {greeting.icon}
                    <h2 className="text-2xl font-bold">{greeting.text}!</h2>
                  </div>
                  <p className="text-indigo-100">Here's your day at a glance</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{completionRate}%</div>
                  <div className="text-indigo-100">Complete</div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Tasks Today</span>
                  <ListTodo size={18} className="text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{completedTasks}/{totalTodayTasks}</div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Habits Done</span>
                  <Check size={18} className="text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{habitsCompletedToday}/{habits.length}</div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Active Goals</span>
                  <Target size={18} className="text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalActiveGoals}</div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Notes</span>
                  <FileText size={18} className="text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{notes.length}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Tasks & Time Blocks */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's Tasks */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <ListTodo size={20} />
                      Today's Tasks
                    </h3>
                    <button
                      onClick={() => setShowNewTask(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {todaysTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          task.completed 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-0.5 flex-shrink-0 ${
                              task.completed ? 'text-green-600' : 'text-gray-400'
                            }`}
                          >
                            {task.completed ? <Check size={20} /> : <Circle size={20} />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-medium ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}>
                                {task.title}
                              </span>
                              {task.priority === 'high' && (
                                <Flag size={14} className="text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="px-2 py-0.5 bg-gray-100 rounded">{task.category}</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {task.timeEstimate}
                              </span>
                              {task.project && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                  {task.project}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingTask(task)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit2 size={14} className="text-gray-400" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {todaysTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <ListTodo size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No tasks for today</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Blocks */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Clock size={20} />
                      Today's Schedule
                    </h3>
                    <button
                      onClick={() => setShowNewTimeBlock(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {timeBlocks.map(block => (
                      <div key={block.id} className="flex items-center gap-3 p-3 border-l-4 border-gray-200 hover:bg-gray-50 rounded group">
                        <div className="text-sm font-medium text-gray-600 w-16">{block.time}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{block.title}</div>
                          <div className="text-xs text-gray-500">{block.duration}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          block.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                          block.type === 'focus' ? 'bg-purple-100 text-purple-700' :
                          block.type === 'break' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {block.type}
                        </span>
                        <button
                          onClick={() => deleteTimeBlock(block.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Habits & Goals */}
              <div className="space-y-6">
                {/* Daily Habits */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Check size={20} />
                      Daily Habits
                    </h3>
                    <button
                      onClick={() => setShowNewHabit(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {habits.map(habit => (
                      <div
                        key={habit.id}
                        className={`p-3 border-2 rounded-lg transition-all group ${
                          habit.completedToday
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-2 flex-1 cursor-pointer"
                            onClick={() => toggleHabit(habit.id)}
                          >
                            {habit.completedToday ? (
                              <Check size={18} className="text-green-600" />
                            ) : (
                              <Circle size={18} className="text-gray-400" />
                            )}
                            <span className={`font-medium ${
                              habit.completedToday ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}>
                              {habit.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {habit.streak > 0 && (
                              <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                                🔥 {habit.streak}
                              </span>
                            )}
                            <button
                              onClick={() => deleteHabit(habit.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Goals Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Target size={20} />
                      Active Goals
                    </h3>
                    <button
                      onClick={() => setShowNewGoal(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {goals.filter(g => g.status === 'in-progress').slice(0, 3).map(goal => (
                      <div key={goal.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="font-medium text-gray-900 text-sm mb-2">{goal.title}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{goal.progress}%</span>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => setActiveView('goals')}
                      className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View all goals →
                    </button>
                  </div>
                </div>

                {/* Pinned Notes */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText size={20} />
                      Pinned Notes
                    </h3>
                    <button
                      onClick={() => setShowNewNote(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {notes.filter(n => n.pinned).map(note => (
                      <div
                        key={note.id}
                        className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
                        onClick={() => setEditingNote(note)}
                      >
                        <div className="font-medium text-gray-900 text-sm mb-1">{note.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{note.content}</div>
                      </div>
                    ))}

                    {notes.filter(n => n.pinned).length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">No pinned notes</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASKS VIEW */}
        {activeView === 'tasks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Tasks</h2>
              <button
                onClick={() => setShowNewTask(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                New Task
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      task.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 flex-shrink-0 ${
                          task.completed ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {task.completed ? <Check size={22} /> : <Circle size={22} />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`font-semibold text-lg ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </span>
                          {task.priority === 'high' && (
                            <Flag size={16} className="text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`px-2 py-1 rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded">{task.category}</span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <Calendar size={14} />
                            {task.due}
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <Clock size={14} />
                            {task.timeEstimate}
                          </span>
                          {task.project && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {task.project}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit2 size={16} className="text-gray-400" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTES VIEW */}
        {activeView === 'notes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
              <button
                onClick={() => setShowNewNote(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                New Note
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.sort((a, b) => b.pinned - a.pinned).map(note => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer relative"
                  onClick={() => setEditingNote(note)}
                >
                  {note.pinned && (
                    <div className="absolute top-3 right-3">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-gray-900 mb-2 pr-6">{note.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-4 mb-3">{note.content}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">{note.category}</span>
                    <span>{note.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOALS VIEW */}
        {activeView === 'goals' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Goals</h2>
              <button
                onClick={() => setShowNewGoal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                New Goal
              </button>
            </div>

            <div className="space-y-4">
              {goals.map(goal => (
                <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{goal.title}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`px-3 py-1 rounded-full ${
                          goal.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {goal.status}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">{goal.category}</span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Calendar size={14} />
                          {goal.deadline}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-indigo-600">{goal.progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                        className="w-48"
                      />
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {goal.milestones && goal.milestones.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones:</h4>
                      <ul className="space-y-1">
                        {goal.milestones.map((milestone, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOURNAL VIEW */}
        {activeView === 'journal' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Journal</h2>
              <button
                onClick={() => setShowJournal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                New Entry
              </button>
            </div>

            <div className="space-y-4">
              {journalEntries.map(entry => (
                <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{entry.date}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      entry.mood === 'great' ? 'bg-green-100 text-green-700' :
                      entry.mood === 'good' ? 'bg-blue-100 text-blue-700' :
                      entry.mood === 'okay' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.mood}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Gratitude</h4>
                      <p className="text-gray-900">{entry.gratitude}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Highlight</h4>
                      <p className="text-gray-900">{entry.highlight}</p>
                    </div>
                    {entry.reflection && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Reflection</h4>
                        <p className="text-gray-900">{entry.reflection}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">New Task</h3>
              <button onClick={() => setShowNewTask(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title..."
                className="w-full px-3 py-2 border rounded-lg"
                autoFocus
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newTask.due}
                  onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={newTask.timeEstimate}
                  onChange={(e) => setNewTask({ ...newTask, timeEstimate: e.target.value })}
                  placeholder="Time estimate"
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <input
                type="text"
                value={newTask.project}
                onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                placeholder="Project (optional)"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewTask(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Edit Task</h3>
              <button onClick={() => setEditingTask(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <select
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateTask(editingTask)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Note Modal */}
      {showNewNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">New Note</h3>
              <button onClick={() => setShowNewNote(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Note title..."
                className="w-full px-3 py-2 border rounded-lg"
                autoFocus
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note here..."
                rows="8"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={newNote.category}
                onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Ideas">Ideas</option>
                <option value="Learning">Learning</option>
              </select>
              <div className="flex gap-3">
                <button onClick={() => setShowNewNote(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addNote} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">Create Note</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">Edit Note</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePinNote(editingNote.id)} className="p-2 hover:bg-gray-100 rounded">
                  <Star size={20} className={editingNote.pinned ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'} />
                </button>
                <button onClick={() => { deleteNote(editingNote.id); setEditingNote(null); }} className="p-2 hover:bg-red-50 rounded">
                  <Trash2 size={20} className="text-red-500" />
                </button>
                <button onClick={() => setEditingNote(null)}><X size={24} /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                rows="10"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={editingNote.category}
                onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Ideas">Ideas</option>
                <option value="Learning">Learning</option>
              </select>
              <div className="flex gap-3">
                <button onClick={() => setEditingNote(null)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={() => updateNote(editingNote)} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {showNewGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">New Goal</h3>
              <button onClick={() => setShowNewGoal(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Goal title..."
                className="w-full px-3 py-2 border rounded-lg"
                autoFocus
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                />
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Learning">Learning</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNewGoal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addGoal} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">Create Goal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Journal Entry Modal */}
      {showJournal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">New Journal Entry</h3>
              <button onClick={() => setShowJournal(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">How are you feeling?</label>
                <select
                  value={newJournalEntry.mood}
                  onChange={(e) => setNewJournalEntry({ ...newJournalEntry, mood: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="great">😄 Great</option>
                  <option value="good">🙂 Good</option>
                  <option value="okay">😐 Okay</option>
                  <option value="bad">😞 Bad</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">What are you grateful for?</label>
                <textarea
                  value={newJournalEntry.gratitude}
                  onChange={(e) => setNewJournalEntry({ ...newJournalEntry, gratitude: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Highlight of the day</label>
                <textarea
                  value={newJournalEntry.highlight}
                  onChange={(e) => setNewJournalEntry({ ...newJournalEntry, highlight: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reflection</label>
                <textarea
                  value={newJournalEntry.reflection}
                  onChange={(e) => setNewJournalEntry({ ...newJournalEntry, reflection: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowJournal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addJournalEntry} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Entry</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Habit Modal */}
      {showNewHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">New Habit</h3>
              <button onClick={() => setShowNewHabit(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Habit Name *</label>
                <input
                  type="text"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                  placeholder="e.g., Morning workout"
                  className="w-full px-3 py-2 border rounded-lg"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <select
                    value={newHabit.icon}
                    onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Target">🎯 Target</option>
                    <option value="Dumbbell">💪 Exercise</option>
                    <option value="Book">📚 Reading</option>
                    <option value="Brain">🧠 Meditation</option>
                    <option value="Droplet">💧 Water</option>
                    <option value="Utensils">🍽️ Food</option>
                    <option value="Heart">❤️ Health</option>
                    <option value="Coffee">☕ Coffee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <select
                    value={newHabit.color}
                    onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="cyan">Cyan</option>
                    <option value="orange">Orange</option>
                    <option value="pink">Pink</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNewHabit(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addHabit} disabled={!newHabit.title.trim()} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">Create Habit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Time Block Modal */}
      {showNewTimeBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">New Time Block</h3>
              <button onClick={() => setShowNewTimeBlock(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={newTimeBlock.title}
                  onChange={(e) => setNewTimeBlock({ ...newTimeBlock, title: e.target.value })}
                  placeholder="e.g., Team meeting"
                  className="w-full px-3 py-2 border rounded-lg"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={newTimeBlock.time}
                    onChange={(e) => setNewTimeBlock({ ...newTimeBlock, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <select
                    value={newTimeBlock.duration}
                    onChange={(e) => setNewTimeBlock({ ...newTimeBlock, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="15m">15 min</option>
                    <option value="30m">30 min</option>
                    <option value="1h">1 hour</option>
                    <option value="1.5h">1.5 hours</option>
                    <option value="2h">2 hours</option>
                    <option value="3h">3 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newTimeBlock.type}
                    onChange={(e) => setNewTimeBlock({ ...newTimeBlock, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="focus">Focus</option>
                    <option value="personal">Personal</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNewTimeBlock(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addTimeBlock} disabled={!newTimeBlock.title.trim()} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">Add Time Block</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalHomeTemplate;