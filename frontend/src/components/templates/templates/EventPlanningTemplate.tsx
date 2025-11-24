import React, { useState } from 'react';
import { 
  ChevronLeft, Calendar, Users, CheckCircle, Circle, DollarSign,
  Plus, MoreVertical, Edit3, Trash2, Search, Filter, Mail,
  MapPin, Clock, User, Phone, MessageSquare, FileText,
  X, Save, BarChart3, Target, Bell, Share2, Download
} from 'lucide-react';

const EventPlanningTemplate = ({ setView, onSave }) => {
  const [event, setEvent] = useState({
    name: 'Company Holiday Party 2025',
    date: '2025-12-20',
    time: '18:00',
    venue: 'Grand Hotel Ballroom',
    address: '123 Main Street, New York, NY',
    budget: 15000,
    attendees: 150,
    description: 'Annual company holiday celebration with dinner, entertainment, and awards ceremony.'
  });

  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Book venue', 
      completed: true, 
      assignee: 'Sarah Chen', 
      dueDate: '2025-11-01',
      priority: 'high',
      description: 'Finalize contract and deposit',
      category: 'venue'
    },
    { 
      id: 2, 
      title: 'Send invitations', 
      completed: true, 
      assignee: 'Mike Rodriguez', 
      dueDate: '2025-11-15',
      priority: 'medium',
      description: 'Design and send digital invitations',
      category: 'marketing'
    },
    { 
      id: 3, 
      title: 'Arrange catering', 
      completed: false, 
      assignee: 'Lisa Park', 
      dueDate: '2025-12-01',
      priority: 'high',
      description: 'Menu tasting and final selection',
      category: 'food'
    },
    { 
      id: 4, 
      title: 'Book entertainment', 
      completed: false, 
      assignee: 'You', 
      dueDate: '2025-12-05',
      priority: 'medium',
      description: 'Live band or DJ for the event',
      category: 'entertainment'
    },
    { 
      id: 5, 
      title: 'Plan decorations', 
      completed: false, 
      assignee: 'Emma Wilson', 
      dueDate: '2025-12-10',
      priority: 'low',
      description: 'Theme: Winter Wonderland',
      category: 'decor'
    }
  ]);

  const [vendors, setVendors] = useState([
    { 
      id: 1, 
      name: 'Delicious Catering Co.', 
      service: 'Food & Beverage', 
      contact: 'John Smith - (555) 123-4567',
      cost: 6000, 
      deposit: 1500,
      status: 'Confirmed',
      notes: 'Vegetarian and gluten-free options required'
    },
    { 
      id: 2, 
      name: 'Party Decor Plus', 
      service: 'Decorations', 
      contact: 'Maria Garcia - (555) 987-6543',
      cost: 2000, 
      deposit: 500,
      status: 'Pending',
      notes: 'Waiting for sample photos'
    },
    { 
      id: 3, 
      name: 'Live Music Band', 
      service: 'Entertainment', 
      contact: 'Alex Johnson - (555) 456-7890',
      cost: 3000, 
      deposit: 1000,
      status: 'Confirmed',
      notes: 'Set list to be finalized 2 weeks before event'
    }
  ]);

  const [guests, setGuests] = useState([
    { id: 1, name: 'Sarah Chen', email: 'sarah@company.com', status: 'Confirmed', role: 'Employee' },
    { id: 2, name: 'Mike Rodriguez', email: 'mike@company.com', status: 'Confirmed', role: 'Employee' },
    { id: 3, name: 'Lisa Park', email: 'lisa@company.com', status: 'Invited', role: 'Employee' },
    { id: 4, name: 'Emma Wilson', email: 'emma@company.com', status: 'Invited', role: 'Employee' },
    { id: 5, name: 'David Kim', email: 'david@company.com', status: 'Declined', role: 'Vendor' }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    description: '',
    category: 'general'
  });

  const [newVendor, setNewVendor] = useState({
    name: '',
    service: '',
    contact: '',
    cost: '',
    deposit: '',
    notes: ''
  });

  // Categories and options
  const taskCategories = ['venue', 'food', 'entertainment', 'decor', 'marketing', 'logistics', 'general'];
  const priorities = ['low', 'medium', 'high'];
  const guestStatuses = ['Invited', 'Confirmed', 'Declined'];
  const vendorStatuses = ['Pending', 'Confirmed', 'Paid', 'Cancelled'];

  // Calculations
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalSpent = vendors.filter(v => v.status === 'Confirmed' || v.status === 'Paid').reduce((sum, v) => sum + v.cost, 0);
  const confirmedGuests = guests.filter(g => g.status === 'Confirmed').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  // Filter tasks
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new task
  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0]
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      description: '',
      category: 'general'
    });
    setShowTaskForm(false);
  };

  // Add new vendor
  const addVendor = () => {
    if (!newVendor.name.trim() || !newVendor.service.trim()) return;

    const vendor = {
      id: Date.now(),
      ...newVendor,
      cost: parseFloat(newVendor.cost) || 0,
      deposit: parseFloat(newVendor.deposit) || 0,
      status: 'Pending'
    };

    setVendors([...vendors, vendor]);
    setNewVendor({
      name: '',
      service: '',
      contact: '',
      cost: '',
      deposit: '',
      notes: ''
    });
    setShowVendorForm(false);
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setDropdownOpen(null);
  };

  // Delete vendor
  const deleteVendor = (vendorId) => {
    setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    setDropdownOpen(null);
  };

  // Update vendor status
  const updateVendorStatus = (vendorId, status) => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status } : vendor
    ));
  };

  const TaskForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Add New Task</h3>
            <button onClick={() => setShowTaskForm(false)} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="What needs to be done?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Who's responsible?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {taskCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Additional details..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addTask}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Add Task
            </button>
            <button
              onClick={() => setShowTaskForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VendorForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Add New Vendor</h3>
            <button onClick={() => setShowVendorForm(false)} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <input
                  type="text"
                  value={newVendor.service}
                  onChange={(e) => setNewVendor({...newVendor, service: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Catering, Decor, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
              <input
                type="text"
                value={newVendor.contact}
                onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Name and phone number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost</label>
                <input
                  type="number"
                  value={newVendor.cost}
                  onChange={(e) => setNewVendor({...newVendor, cost: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deposit</label>
                <input
                  type="number"
                  value={newVendor.deposit}
                  onChange={(e) => setNewVendor({...newVendor, deposit: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={newVendor.notes}
                onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Special requirements, contact details..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addVendor}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Add Vendor
            </button>
            <button
              onClick={() => setShowVendorForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Event Planning</h1>
                  <p className="text-sm text-gray-600">Plan and manage your events efficiently</p>
                </div>
              </div>
            </div>
            <button onClick={() => onSave({ event, tasks, vendors, guests })} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Save to Workspace
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Event Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-4">{event.name}</h2>
              <p className="text-pink-100 mb-6 max-w-2xl">{event.description}</p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-pink-100 text-sm mb-1">Date & Time</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Calendar size={18} />
                    {event.date} at {event.time}
                  </div>
                </div>
                <div>
                  <div className="text-pink-100 text-sm mb-1">Venue</div>
                  <div className="font-semibold flex items-center gap-2">
                    <MapPin size={18} />
                    {event.venue}
                  </div>
                </div>
                <div>
                  <div className="text-pink-100 text-sm mb-1">Expected Attendees</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Users size={18} />
                    {event.attendees} ({confirmedGuests} confirmed)
                  </div>
                </div>
                <div>
                  <div className="text-pink-100 text-sm mb-1">Budget</div>
                  <div className="font-semibold flex items-center gap-2">
                    <DollarSign size={18} />
                    ${event.budget.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              activeTab === 'overview' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              activeTab === 'tasks' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              activeTab === 'vendors' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Vendors
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              activeTab === 'guests' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Guests
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-2">Tasks Progress</div>
                <div className="text-3xl font-bold text-gray-900 mb-3">{completedTasks}/{tasks.length}</div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-2">Budget Used</div>
                <div className="text-3xl font-bold text-gray-900 mb-3">${totalSpent.toLocaleString()}</div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(totalSpent / event.budget) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-2">Budget Remaining</div>
                <div className="text-3xl font-bold text-gray-900">${(event.budget - totalSpent).toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-2">High Priority Tasks</div>
                <div className="text-3xl font-bold text-gray-900">{highPriorityTasks}</div>
                <div className="text-sm text-gray-500 mt-1">Urgent items</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Tasks */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {tasks.filter(t => !t.completed).slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className="mt-0.5"
                      >
                        {task.completed ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <Circle size={20} className="text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {task.assignee} • Due: {task.dueDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendor Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Vendor Summary</h3>
                  <button 
                    onClick={() => setActiveTab('vendors')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {vendors.slice(0, 4).map(vendor => (
                    <div key={vendor.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.service}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          vendor.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          vendor.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {vendor.status}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">${vendor.cost.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-64"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 w-fit"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>
            </div>

            <div className="divide-y">
              {filteredTasks.map(task => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className="mt-0.5"
                      >
                        {task.completed ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <Circle size={20} className="text-gray-400" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {task.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            Due: {task.dueDate}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {task.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button 
                        onClick={() => setDropdownOpen(dropdownOpen === task.id ? null : task.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {dropdownOpen === task.id && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50">
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
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
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <Target className="mx-auto text-gray-400" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mt-4">No tasks found</h3>
                <p className="text-gray-600 mt-2">Create your first task to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Vendors & Suppliers</h3>
                <button
                  onClick={() => setShowVendorForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus size={16} />
                  Add Vendor
                </button>
              </div>
            </div>

            <div className="divide-y">
              {vendors.map(vendor => (
                <div key={vendor.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{vendor.name}</h4>
                        <select
                          value={vendor.status}
                          onChange={(e) => updateVendorStatus(vendor.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded border ${
                            vendor.status === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                            vendor.status === 'Paid' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            vendor.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }`}
                        >
                          {vendorStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Service</p>
                          <p className="font-medium">{vendor.service}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-medium">{vendor.contact}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Total Cost</p>
                          <p className="text-lg font-bold text-gray-900">${vendor.cost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Deposit</p>
                          <p className="text-lg font-bold text-gray-900">${vendor.deposit.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Balance</p>
                          <p className="text-lg font-bold text-gray-900">${(vendor.cost - vendor.deposit).toLocaleString()}</p>
                        </div>
                      </div>

                      {vendor.notes && (
                        <div>
                          <p className="text-sm text-gray-600">Notes</p>
                          <p className="text-gray-700">{vendor.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="relative ml-4">
                      <button 
                        onClick={() => setDropdownOpen(dropdownOpen === vendor.id ? null : vendor.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {dropdownOpen === vendor.id && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50">
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteVendor(vendor.id)}
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
              ))}
            </div>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Guest List</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">{confirmedGuests} confirmed</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                    <Mail size={16} />
                    Send Invitations
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y">
              {guests.map(guest => (
                <div key={guest.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {guest.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{guest.name}</h4>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{guest.role}</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        guest.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        guest.status === 'Declined' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {guest.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showTaskForm && <TaskForm />}
      {showVendorForm && <VendorForm />}

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

export default EventPlanningTemplate;