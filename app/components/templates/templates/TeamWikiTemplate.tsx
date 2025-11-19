import React, { useState } from 'react';
import { ChevronLeft, FileText, Folder, Plus, Search, X, Edit2, Trash2, Save, Eye, BookOpen, Tag, Clock, User } from 'lucide-react';

const TeamWikiTemplate = ({ setView, onSave }) => {
  const [pages, setPages] = useState([
    { 
      id: 1, 
      title: 'Getting Started Guide', 
      category: 'Onboarding', 
      content: 'Welcome to the team! Here is everything you need to know to get started with our company culture, tools, and processes. This guide will help you navigate your first weeks and become productive quickly.',
      author: 'You',
      createdDate: '2025-11-01',
      lastModified: '2025-11-10',
      tags: ['guide', 'new-hire', 'important']
    },
    { 
      id: 2, 
      title: 'Code Style Guide', 
      category: 'Development', 
      content: 'Our coding standards and best practices for writing clean, maintainable code. This includes naming conventions, code structure, commenting standards, and code review processes.',
      author: 'Sarah',
      createdDate: '2025-10-15',
      lastModified: '2025-11-08',
      tags: ['development', 'standards', 'important']
    },
    { 
      id: 3, 
      title: 'Deployment Process', 
      category: 'DevOps', 
      content: 'Step-by-step guide to deploying our applications to production. Covers staging, testing, approval workflows, and rollback procedures.',
      author: 'Mike',
      createdDate: '2025-10-20',
      lastModified: '2025-11-05',
      tags: ['devops', 'deployment', 'critical']
    },
    { 
      id: 4, 
      title: 'Meeting Schedule', 
      category: 'Operations', 
      content: 'Weekly team meetings and standups schedule. Includes meeting purposes, required attendees, and agenda templates.',
      author: 'Lisa',
      createdDate: '2025-10-10',
      lastModified: '2025-11-11',
      tags: ['meetings', 'schedule']
    },
    { 
      id: 5, 
      title: 'API Documentation', 
      category: 'Development', 
      content: 'Complete API reference with endpoints, request/response formats, authentication, and usage examples.',
      author: 'Alex',
      createdDate: '2025-09-25',
      lastModified: '2025-11-09',
      tags: ['api', 'documentation', 'technical']
    },
    { 
      id: 6, 
      title: 'Brand Guidelines', 
      category: 'Marketing', 
      content: 'Official brand guidelines including logo usage, color palette, typography, and brand voice.',
      author: 'Emma',
      createdDate: '2025-09-15',
      lastModified: '2025-10-30',
      tags: ['brand', 'design', 'marketing']
    }
  ]);

  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPage, setShowNewPage] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'view'
  
  const [newPage, setNewPage] = useState({
    title: '',
    category: 'General',
    content: '',
    tags: ''
  });

  // Get unique categories
  const categories = ['all', ...new Set(pages.map(p => p.category))];

  // Filter pages
  const filteredPages = pages.filter(page => {
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
    const matchesSearch = 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Add new page
  const addPage = () => {
    if (newPage.title.trim() && newPage.content.trim()) {
      const page = {
        id: Date.now(),
        title: newPage.title,
        category: newPage.category,
        content: newPage.content,
        author: 'You',
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        tags: newPage.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      
      setPages([page, ...pages]);
      setNewPage({ title: '', category: 'General', content: '', tags: '' });
      setShowNewPage(false);
      setSelectedPage(page);
    }
  };

  // Update page
  const updatePage = (updatedPage) => {
    setPages(pages.map(p => 
      p.id === updatedPage.id 
        ? { ...updatedPage, lastModified: new Date().toISOString().split('T')[0] }
        : p
    ));
    setEditingPage(null);
    setSelectedPage({ ...updatedPage, lastModified: new Date().toISOString().split('T')[0] });
  };

  // Delete page
  const deletePage = (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(p => p.id !== id));
      if (selectedPage?.id === id) {
        setSelectedPage(null);
      }
    }
  };

  // Category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Development': return '💻';
      case 'DevOps': return '🔧';
      case 'Marketing': return '📢';
      case 'Operations': return '⚙️';
      case 'Onboarding': return '👋';
      default: return '📄';
    }
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
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                  🌐
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Team Wiki</h1>
                  <p className="text-sm text-gray-500">{pages.length} pages</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewPage(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                New Page
              </button>
              
              <button 
                onClick={() => onSave({ pages })}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={16} className="text-blue-600" />
              <span className="text-sm text-gray-600">Total Pages</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{pages.length}</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Folder size={16} className="text-purple-600" />
              <span className="text-sm text-gray-600">Categories</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{categories.length - 1}</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-green-600" />
              <span className="text-sm text-gray-600">Updated Today</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {pages.filter(p => p.lastModified === new Date().toISOString().split('T')[0]).length}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <User size={16} className="text-orange-600" />
              <span className="text-sm text-gray-600">Contributors</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(pages.map(p => p.author)).size}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <h3 className="font-semibold mb-3 text-sm text-gray-700">Categories</h3>
              <div className="space-y-1">
                {categories.map(cat => {
                  const count = cat === 'all' ? pages.length : pages.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedCategory === cat
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {cat !== 'all' && <span>{getCategoryIcon(cat)}</span>}
                          {cat === 'all' ? 'All Pages' : cat}
                        </span>
                        <span className={`text-xs ${selectedCategory === cat ? 'text-blue-600' : 'text-gray-400'}`}>
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3 text-sm text-gray-700">Quick Actions</h3>
                <button
                  onClick={() => setShowNewPage(true)}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  New Page
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            {selectedPage ? (
              /* Page View */
              <div className="bg-white rounded-xl border border-gray-200">
                {/* Page Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getCategoryIcon(selectedPage.category)}</span>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedPage.title}</h2>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {selectedPage.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          Updated {selectedPage.lastModified}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {selectedPage.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPage(selectedPage);
                          setSelectedPage(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit page"
                      >
                        <Edit2 size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => deletePage(selectedPage.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete page"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                      <button
                        onClick={() => setSelectedPage(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedPage.tags && selectedPage.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag size={14} className="text-gray-400" />
                      {selectedPage.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Page Content */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedPage.content}
                    </p>
                  </div>
                </div>

                {/* Page Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Created on {selectedPage.createdDate}</span>
                    <button
                      onClick={() => setSelectedPage(null)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ← Back to pages
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Pages List */
              <>
                {/* List Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedCategory === 'all' ? 'All Pages' : selectedCategory}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredPages.length} page{filteredPages.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Pages Grid */}
                {filteredPages.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPages.map(page => (
                      <div
                        key={page.id}
                        onClick={() => setSelectedPage(page)}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl group-hover:bg-blue-200 transition-colors">
                            {getCategoryIcon(page.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                  {page.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                    {page.category}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User size={12} />
                                    {page.author}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {page.lastModified}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingPage(page);
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                  <Edit2 size={14} className="text-gray-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePage(page.id);
                                  }}
                                  className="p-2 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 size={14} className="text-red-600" />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 line-clamp-2 mb-3">{page.content}</p>
                            {page.tags && page.tags.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                {page.tags.map((tag, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery ? 'Try adjusting your search' : 'Create your first page to get started'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => setShowNewPage(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                      >
                        <Plus size={20} />
                        New Page
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* New Page Modal */}
      {showNewPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">Create New Page</h3>
              <button
                onClick={() => setShowNewPage(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                    placeholder="Enter page title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newPage.category}
                      onChange={(e) => setNewPage({ ...newPage, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>General</option>
                      <option>Development</option>
                      <option>DevOps</option>
                      <option>Marketing</option>
                      <option>Operations</option>
                      <option>Onboarding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newPage.tags}
                      onChange={(e) => setNewPage({ ...newPage, tags: e.target.value })}
                      placeholder="guide, important, new"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newPage.content}
                    onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                    placeholder="Write your page content here..."
                    rows="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewPage(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addPage}
                  disabled={!newPage.title.trim() || !newPage.content.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">Edit Page</h3>
              <button
                onClick={() => setEditingPage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editingPage.category}
                      onChange={(e) => setEditingPage({ ...editingPage, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>General</option>
                      <option>Development</option>
                      <option>DevOps</option>
                      <option>Marketing</option>
                      <option>Operations</option>
                      <option>Onboarding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingPage.tags ? editingPage.tags.join(', ') : ''}
                      onChange={(e) => setEditingPage({ 
                        ...editingPage, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={editingPage.content}
                    onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                    rows="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingPage(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updatePage(editingPage)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamWikiTemplate;