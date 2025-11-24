import React, { useState } from 'react';
import { ChevronLeft, Plus, Folder, Users, Calendar, TrendingUp, CheckCircle, Circle, AlertCircle, Clock, BarChart3, Target, Edit2 } from 'lucide-react';

const ProjectTrackerTemplate = ({ setView, onSave }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      status: 'In Progress',
      progress: 65,
      startDate: '2025-10-01',
      endDate: '2025-12-15',
      team: ['You', 'Sarah', 'Mike'],
      budget: '$50,000',
      priority: 'High',
      milestones: [
        { id: 1, title: 'Design mockups', completed: true, dueDate: '2025-10-15' },
        { id: 2, title: 'Frontend development', completed: true, dueDate: '2025-11-01' },
        { id: 3, title: 'Backend integration', completed: false, dueDate: '2025-11-20' },
        { id: 4, title: 'Testing & QA', completed: false, dueDate: '2025-12-10' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      status: 'Planning',
      progress: 15,
      startDate: '2025-11-01',
      endDate: '2026-03-31',
      team: ['You', 'Alex'],
      budget: '$120,000',
      priority: 'High',
      milestones: [
        { id: 5, title: 'Requirements gathering', completed: true, dueDate: '2025-11-10' },
        { id: 6, title: 'Architecture design', completed: false, dueDate: '2025-11-25' },
        { id: 7, title: 'MVP development', completed: false, dueDate: '2026-01-30' }
      ]
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      status: 'Completed',
      progress: 100,
      startDate: '2025-09-01',
      endDate: '2025-10-31',
      team: ['Lisa', 'Tom'],
      budget: '$25,000',
      priority: 'Medium',
      milestones: [
        { id: 8, title: 'Campaign strategy', completed: true, dueDate: '2025-09-10' },
        { id: 9, title: 'Content creation', completed: true, dueDate: '2025-09-25' },
        { id: 10, title: 'Launch campaign', completed: true, dueDate: '2025-10-15' }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'timeline', 'gantt'
  const [editingTimeline, setEditingTimeline] = useState(null);
  
  const [newProject, setNewProject] = useState({
    name: '',
    status: 'Planning',
    startDate: '',
    endDate: '',
    budget: '',
    priority: 'Medium'
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'On Hold': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Calculate days elapsed, remaining, and total
  const getTimelineStats = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    
    const timeProgress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
    
    return {
      totalDays,
      elapsedDays: Math.max(0, elapsedDays),
      remainingDays: Math.max(0, remainingDays),
      timeProgress: timeProgress.toFixed(0),
      isOverdue: remainingDays < 0
    };
  };

  const addProject = () => {
    if (newProject.name.trim()) {
      setProjects([...projects, {
        id: Date.now(),
        name: newProject.name,
        status: newProject.status,
        progress: 0,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        team: ['You'],
        budget: newProject.budget,
        priority: newProject.priority,
        milestones: []
      }]);
      setNewProject({
        name: '',
        status: 'Planning',
        startDate: '',
        endDate: '',
        budget: '',
        priority: 'Medium'
      });
      setShowNewProject(false);
    }
  };

  const toggleMilestone = (projectId, milestoneId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const updatedMilestones = project.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : 0;
        return { ...project, milestones: updatedMilestones, progress };
      }
      return project;
    }));
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  const updateProjectDates = (projectId, newStartDate, newEndDate) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, startDate: newStartDate, endDate: newEndDate } : p
    ));
  };

  const addMilestone = (projectId) => {
    const milestoneName = prompt('Enter milestone name:');
    const milestoneDate = prompt('Enter due date (YYYY-MM-DD):');
    
    if (milestoneName && milestoneDate) {
      setProjects(projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            milestones: [...p.milestones, {
              id: Date.now(),
              title: milestoneName,
              completed: false,
              dueDate: milestoneDate
            }]
          };
        }
        return p;
      }));
    }
  };

  const renderTimelineView = () => {
    return (
      <div className="space-y-6">
        {projects.map(project => {
          const timeStats = getTimelineStats(project.startDate, project.endDate);
          
          return (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Project Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                    <Folder size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Details →
                </button>
              </div>

              {/* Timeline Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-600 mb-1">Total Duration</div>
                  <div className="text-lg font-bold text-blue-900">{timeStats.totalDays} days</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-green-600 mb-1">Days Elapsed</div>
                  <div className="text-lg font-bold text-green-900">{timeStats.elapsedDays} days</div>
                </div>
                <div className={`rounded-lg p-3 ${timeStats.isOverdue ? 'bg-red-50' : 'bg-purple-50'}`}>
                  <div className={`text-xs mb-1 ${timeStats.isOverdue ? 'text-red-600' : 'text-purple-600'}`}>
                    Days Remaining
                  </div>
                  <div className={`text-lg font-bold ${timeStats.isOverdue ? 'text-red-900' : 'text-purple-900'}`}>
                    {timeStats.isOverdue ? 'OVERDUE!' : `${timeStats.remainingDays} days`}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-orange-600 mb-1">Time Progress</div>
                  <div className="text-lg font-bold text-orange-900">{timeStats.timeProgress}%</div>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-600">{project.startDate}</span>
                    {editingTimeline === project.id ? (
                      <input
                        type="date"
                        value={project.startDate}
                        onChange={(e) => updateProjectDates(project.id, e.target.value, project.endDate)}
                        className="px-2 py-1 border rounded text-xs"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingTimeline(project.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 size={12} className="text-gray-400" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editingTimeline === project.id ? (
                      <>
                        <input
                          type="date"
                          value={project.endDate}
                          onChange={(e) => updateProjectDates(project.id, project.startDate, e.target.value)}
                          className="px-2 py-1 border rounded text-xs"
                        />
                        <button
                          onClick={() => setEditingTimeline(null)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                        >
                          Done
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-600">{project.endDate}</span>
                    )}
                    <Calendar size={14} className="text-gray-500" />
                  </div>
                </div>

                {/* Progress Bars - Dual Layer */}
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  {/* Time Progress (Background) */}
                  <div
                    className={`absolute inset-0 transition-all ${
                      timeStats.isOverdue ? 'bg-red-200' : 'bg-blue-200'
                    }`}
                    style={{ width: `${Math.min(100, timeStats.timeProgress)}%` }}
                  >
                    <div className="h-full flex items-center justify-end pr-2">
                      <span className="text-xs font-medium text-blue-900">
                        Time: {timeStats.timeProgress}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Work Progress (Foreground) */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    style={{ width: `${project.progress}%` }}
                  >
                    <div className="h-full flex items-center justify-end pr-2">
                      <span className="text-xs font-bold text-white">
                        Work: {project.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Today Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                    style={{ left: `${Math.min(100, timeStats.timeProgress)}%` }}
                  >
                    <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs text-red-600 font-medium whitespace-nowrap">
                      Today
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-200 rounded"></div>
                    <span>Time Elapsed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                    <span>Work Completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-3 bg-red-500"></div>
                    <span>Current Date</span>
                  </div>
                </div>
              </div>

              {/* Milestones on Timeline */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Milestones</h4>
                  <button
                    onClick={() => addMilestone(project.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Milestone
                  </button>
                </div>
                
                <div className="space-y-2">
                  {project.milestones.map((milestone) => {
                    const milestoneDate = new Date(milestone.dueDate);
                    const startDate = new Date(project.startDate);
                    const endDate = new Date(project.endDate);
                    const totalDuration = endDate - startDate;
                    const milestonePosition = ((milestoneDate - startDate) / totalDuration) * 100;

                    return (
                      <div key={milestone.id} className="flex items-center gap-3">
                        <button onClick={() => toggleMilestone(project.id, milestone.id)}>
                          {milestone.completed ? (
                            <CheckCircle size={18} className="text-green-600" />
                          ) : (
                            <Circle size={18} className="text-gray-400" />
                          )}
                        </button>
                        
                        <div className="flex-1 relative">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {milestone.title}
                            </span>
                            <span className="text-xs text-gray-500">{milestone.dueDate}</span>
                          </div>
                          
                          {/* Milestone position indicator */}
                          <div className="relative h-2 bg-gray-100 rounded-full mt-1">
                            <div
                              className={`absolute top-0 w-2 h-2 rounded-full ${
                                milestone.completed ? 'bg-green-500' : 'bg-orange-500'
                              }`}
                              style={{ left: `${Math.max(0, Math.min(100, milestonePosition))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Health Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                {project.progress < timeStats.timeProgress && !timeStats.isOverdue ? (
                  <div className="flex items-center gap-2 text-yellow-600 text-sm">
                    <AlertCircle size={16} />
                    <span>Project is behind schedule - Work progress ({project.progress}%) is slower than time elapsed ({timeStats.timeProgress}%)</span>
                  </div>
                ) : project.progress >= timeStats.timeProgress ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle size={16} />
                    <span>Project is on track or ahead of schedule!</span>
                  </div>
                ) : timeStats.isOverdue ? (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    <span>Project is overdue! Please review timeline or extend deadline.</span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGanttView = () => {
    const allDates = projects.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));
    const totalDuration = maxDate - minDate;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-6">Gantt Chart View</h3>
        
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex items-center mb-4">
            <div className="w-48 text-sm font-medium text-gray-600">Project</div>
            <div className="flex-1 relative h-8 bg-gray-50 rounded">
              {/* Month markers */}
              <div className="flex h-full">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-gray-200 flex items-center justify-center text-xs text-gray-500"
                  >
                    {new Date(2025, i).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Bars */}
          {projects.map(project => {
            const start = new Date(project.startDate);
            const end = new Date(project.endDate);
            const projectStart = ((start - minDate) / totalDuration) * 100;
            const projectWidth = ((end - start) / totalDuration) * 100;

            return (
              <div key={project.id} className="flex items-center mb-3">
                <div className="w-48 text-sm text-gray-900 pr-4 truncate">
                  {project.name}
                </div>
                <div className="flex-1 relative h-10">
                  <div
                    className="absolute h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded cursor-pointer hover:shadow-lg transition-shadow group"
                    style={{
                      left: `${projectStart}%`,
                      width: `${projectWidth}%`
                    }}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="h-full flex items-center justify-center text-white text-xs font-medium px-2">
                      <span className="truncate">{project.progress}%</span>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {project.startDate} → {project.endDate}
                      <div className="text-gray-300">{project.status} • {project.progress}%</div>
                    </div>
                  </div>

                  {/* Milestones */}
                  {project.milestones.map(milestone => {
                    const milestoneDate = new Date(milestone.dueDate);
                    const milestonePos = ((milestoneDate - minDate) / totalDuration) * 100;
                    
                    return (
                      <div
                        key={milestone.id}
                        className="absolute w-2 h-2 -translate-x-1/2 rounded-full z-10"
                        style={{
                          left: `${milestonePos}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: milestone.completed ? '#10b981' : '#f59e0b'
                        }}
                        title={milestone.title}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProjectCard = (project) => {
    const timeStats = getTimelineStats(project.startDate, project.endDate);

    return (
      <div
        key={project.id}
        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => setSelectedProject(project)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
              <Folder size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded border font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-gray-900">{project.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
          <div className="bg-gray-50 rounded p-2">
            <div className="text-gray-500 text-xs">Team</div>
            <div className="font-medium text-gray-900">{project.team.length}</div>
          </div>
          <div className={`rounded p-2 ${timeStats.isOverdue ? 'bg-red-50' : 'bg-blue-50'}`}>
            <div className={`text-xs ${timeStats.isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
              {timeStats.isOverdue ? 'Overdue' : 'Days Left'}
            </div>
            <div className={`font-medium ${timeStats.isOverdue ? 'text-red-900' : 'text-blue-900'}`}>
              {timeStats.isOverdue ? 'LATE!' : timeStats.remainingDays}
            </div>
          </div>
          <div className="bg-green-50 rounded p-2">
            <div className="text-green-600 text-xs">Milestones</div>
            <div className="font-medium text-green-900">
              {project.milestones.filter(m => m.completed).length}/{project.milestones.length}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} />
          <span>{project.startDate} → {project.endDate}</span>
        </div>
      </div>
    );
  };

  const renderProjectDetails = () => {
    if (!selectedProject) return null;
    const timeStats = getTimelineStats(selectedProject.startDate, selectedProject.endDate);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  <Folder size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm px-3 py-1 rounded border font-medium ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded font-medium ${getPriorityColor(selectedProject.priority)}`}>
                      {selectedProject.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-blue-600" size={20} />
                  <span className="text-sm font-medium text-blue-900">Progress</span>
                </div>
                <div className="text-3xl font-bold text-blue-900">{selectedProject.progress}%</div>
              </div>

              <div className={`rounded-xl p-4 ${timeStats.isOverdue ? 'bg-gradient-to-br from-red-50 to-red-100' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Clock className={timeStats.isOverdue ? 'text-red-600' : 'text-purple-600'} size={20} />
                  <span className={`text-sm font-medium ${timeStats.isOverdue ? 'text-red-900' : 'text-purple-900'}`}>
                    Days Remaining
                  </span>
                </div>
                <div className={`text-3xl font-bold ${timeStats.isOverdue ? 'text-red-900' : 'text-purple-900'}`}>
                  {timeStats.isOverdue ? 'OVERDUE' : timeStats.remainingDays}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-green-900">Milestones</span>
                </div>
                <div className="text-3xl font-bold text-green-900">
                  {selectedProject.milestones.filter(m => m.completed).length}/{selectedProject.milestones.length}
                </div>
              </div>
            </div>

            {/* Enhanced Timeline */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={18} />
                Project Timeline & Progress
              </h3>
              
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-600">Total Duration</div>
                  <div className="text-2xl font-bold text-gray-900">{timeStats.totalDays}</div>
                  <div className="text-xs text-gray-500">days</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">Days Elapsed</div>
                  <div className="text-2xl font-bold text-blue-600">{timeStats.elapsedDays}</div>
                  <div className="text-xs text-gray-500">days</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">Time Progress</div>
                  <div className="text-2xl font-bold text-purple-600">{timeStats.timeProgress}%</div>
                  <div className="text-xs text-gray-500">of timeline</div>
                </div>
              </div>

              {/* Date Range */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{selectedProject.startDate}</div>
                  <div className="text-xs text-gray-500">Start Date</div>
                </div>
                <div className="flex-1 mx-4 border-t-2 border-dashed border-gray-300"></div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{selectedProject.endDate}</div>
                  <div className="text-xs text-gray-500">End Date</div>
                </div>
              </div>

              {/* Dual Progress Bar */}
              <div className="relative h-10 bg-white rounded-lg overflow-hidden border border-gray-200">
                {/* Time Progress */}
                <div
                  className={`absolute inset-0 transition-all ${timeStats.isOverdue ? 'bg-red-200' : 'bg-blue-200'}`}
                  style={{ width: `${Math.min(100, timeStats.timeProgress)}%` }}
                />
                
                {/* Work Progress */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                  style={{ width: `${selectedProject.progress}%` }}
                />

                {/* Today Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-red-500 z-10"
                  style={{ left: `${Math.min(100, timeStats.timeProgress)}%` }}
                >
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Labels */}
                <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
                  <span className="text-white drop-shadow">Work: {selectedProject.progress}%</span>
                  <span className={timeStats.isOverdue ? 'text-red-900' : 'text-blue-900'}>
                    Time: {timeStats.timeProgress}%
                  </span>
                </div>
              </div>

              {/* Budget */}
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600">Budget</div>
                <div className="text-xl font-bold text-gray-900">{selectedProject.budget}</div>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Target size={18} />
                  Milestones
                </h3>
                <button
                  onClick={() => addMilestone(selectedProject.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Milestone
                </button>
              </div>
              <div className="space-y-3">
                {selectedProject.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <button
                      onClick={() => toggleMilestone(selectedProject.id, milestone.id)}
                      className="mt-1"
                    >
                      {milestone.completed ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : (
                        <Circle size={20} className="text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {milestone.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>Due: {milestone.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={18} />
                Team Members
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedProject.team.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {member[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => deleteProject(selectedProject.id)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete Project
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
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
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                  📊
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">Project Tracker</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'timeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('gantt')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'gantt' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Gantt
                </button>
              </div>

              <button 
                onClick={() => onSave({ projects })}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Save to workspace
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {viewMode === 'cards' && 'All Projects'}
              {viewMode === 'timeline' && 'Timeline View'}
              {viewMode === 'gantt' && 'Gantt Chart'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {projects.length} total projects • {projects.filter(p => p.status === 'In Progress').length} in progress
            </p>
          </div>
          
          <button
            onClick={() => setShowNewProject(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        {/* Render Based on View Mode */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => renderProjectCard(project))}
          </div>
        )}

        {viewMode === 'timeline' && renderTimelineView()}
        {viewMode === 'gantt' && renderGanttView()}

        {projects.length === 0 && (
          <div className="text-center py-16">
            <Folder size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Create your first project to get started</p>
            <button
              onClick={() => setShowNewProject(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Project
            </button>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {renderProjectDetails()}

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">New Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>On Hold</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <input
                  type="text"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  placeholder="e.g., $50,000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewProject(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTrackerTemplate;