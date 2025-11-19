import React, { useState } from 'react';
import { 
  ChevronLeft, Calendar, Instagram, Twitter, Linkedin, Facebook, 
  Plus, MoreVertical, Edit3, Trash2, Search, Filter, 
  BarChart3, Eye, Clock, CheckCircle, XCircle, Youtube,
  MessageCircle, Send
} from 'lucide-react';

const ContentCalendarTemplate = ({ setView, onSave }) => {
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      title: 'Product Launch Announcement', 
      description: 'Introducing our new product line with special launch offers',
      platform: 'Instagram', 
      date: '2025-11-15', 
      time: '14:00',
      status: 'Scheduled', 
      type: 'Image',
      engagement: 2450,
      scheduled: true,
      content: '🚀 Big news! Our new product line is here! ✨',
      hashtags: ['#productlaunch', '#newarrival', '#innovation'],
      metrics: { likes: 1200, comments: 85, shares: 45 }
    },
    { 
      id: 2, 
      title: 'Behind the Scenes Video', 
      description: 'Showcasing our team working on the new project',
      platform: 'TikTok', 
      date: '2025-11-16', 
      time: '18:30',
      status: 'Draft', 
      type: 'Video',
      engagement: 0,
      scheduled: false,
      content: 'Ever wondered what goes on behind the scenes? 👀',
      hashtags: ['#behindthescenes', '#teamwork', '#creative'],
      metrics: { likes: 0, comments: 0, shares: 0 }
    },
    { 
      id: 3, 
      title: 'Customer Testimonial', 
      description: 'Sharing positive feedback from our happy customers',
      platform: 'LinkedIn', 
      date: '2025-11-17', 
      time: '09:00',
      status: 'Scheduled', 
      type: 'Post',
      engagement: 890,
      scheduled: true,
      content: 'Hear what our customers have to say about us! 💬',
      hashtags: ['#testimonial', '#customerlove', '#success'],
      metrics: { likes: 450, comments: 23, shares: 12 }
    },
    { 
      id: 4, 
      title: 'Industry News Share', 
      description: 'Latest updates and trends in our industry',
      platform: 'Twitter', 
      date: '2025-11-18', 
      time: '12:00',
      status: 'Published', 
      type: 'Tweet',
      engagement: 1560,
      scheduled: false,
      content: 'Breaking news in the industry! What are your thoughts?',
      hashtags: ['#industrynews', '#trending', '#insights'],
      metrics: { likes: 890, comments: 67, shares: 34 }
    }
  ]);

  const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'list', 'analytics'
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    platform: 'Instagram',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'Image',
    content: '',
    hashtags: []
  });

  const platforms = ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube'];
  const statuses = ['Draft', 'Scheduled', 'Published', 'Cancelled'];

  const getPlatformIcon = (platform) => {
    const icons = {
      'Instagram': <Instagram size={18} className="text-pink-600" />,
      'Twitter': <Twitter size={18} className="text-blue-400" />,
      'LinkedIn': <Linkedin size={18} className="text-blue-700" />,
      'Facebook': <Facebook size={18} className="text-blue-600" />,
      'TikTok': <MessageCircle size={18} className="text-black" />,
      'YouTube': <Youtube size={18} className="text-red-600" />
    };
    return icons[platform] || <Calendar size={18} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Published': 'bg-green-100 text-green-700 border-green-200',
      'Scheduled': 'bg-blue-100 text-blue-700 border-blue-200',
      'Draft': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Image': 'bg-purple-100 text-purple-700',
      'Video': 'bg-red-100 text-red-700',
      'Post': 'bg-blue-100 text-blue-700',
      'Tweet': 'bg-cyan-100 text-cyan-700',
      'Story': 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const addPost = () => {
    if (!newPost.title.trim()) return;

    const post = {
      id: Date.now(),
      ...newPost,
      status: 'Draft',
      engagement: 0,
      scheduled: false,
      metrics: { likes: 0, comments: 0, shares: 0 },
      hashtags: newPost.hashtags
    };

    setPosts([...posts, post]);
    setNewPost({
      title: '',
      description: '',
      platform: 'Instagram',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      type: 'Image',
      content: '',
      hashtags: []
    });
    setShowAddForm(false);
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
    setSelectedPost(null);
  };

  const updatePostStatus = (postId, status) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, status, scheduled: status === 'Scheduled' }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || post.platform === filterPlatform;
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const analytics = {
    totalPosts: posts.length,
    scheduled: posts.filter(p => p.status === 'Scheduled').length,
    published: posts.filter(p => p.status === 'Published').length,
    totalEngagement: posts.reduce((sum, post) => sum + post.engagement, 0),
    averageEngagement: Math.round(posts.reduce((sum, post) => sum + post.engagement, 0) / posts.length) || 0
  };

  const CalendarView = () => (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
        <div key={day} className="text-center">
          <div className="font-semibold text-gray-900 mb-2">{day}</div>
          <div className="space-y-2">
            {filteredPosts.filter(post => {
              const postDate = new Date(post.date);
              return postDate.getDay() === ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
            }).map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  getStatusColor(post.status)
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getPlatformIcon(post.platform)}
                  <span className="text-xs font-medium truncate">{post.platform}</span>
                </div>
                <p className="text-sm font-semibold truncate">{post.title}</p>
                <p className="text-xs text-gray-600">{post.time}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="bg-white rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Content</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Platform</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date & Time</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Engagement</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredPosts.map(post => (
            <tr key={post.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedPost(post)}>
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-600 truncate max-w-xs">{post.description}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(post.type)}`}>
                    {post.type}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(post.platform)}
                  <span className="font-medium">{post.platform}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium">{post.date}</div>
                <div className="text-xs text-gray-600">{post.time}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-semibold">{post.engagement.toLocaleString()}</div>
                <div className="text-xs text-gray-600">
                  {post.metrics.likes} likes
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {post.status === 'Draft' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); updatePostStatus(post.id, 'Scheduled'); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Send size={16} />
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); deletePost(post.id); }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Content Calendar</h1>
                  <p className="text-sm text-gray-600">Plan, schedule, and analyze your content</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => onSave({ posts })} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Save to workspace
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold">{analytics.totalPosts}</p>
              </div>
              <Calendar className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{analytics.scheduled}</p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold">{analytics.published}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold">{analytics.totalEngagement.toLocaleString()}</p>
              </div>
              <BarChart3 className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Engagement</p>
                <p className="text-2xl font-bold">{analytics.averageEngagement.toLocaleString()}</p>
              </div>
              <Eye className="text-red-500" size={24} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                List
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="all">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 w-fit"
          >
            <Plus size={16} />
            New Post
          </button>
        </div>

        {/* Content */}
        {viewMode === 'calendar' ? <CalendarView /> : <ListView />}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mt-4">No content found</h3>
            <p className="text-gray-600 mt-2">Create your first post to start planning your content calendar</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Create Your First Post
            </button>
          </div>
        )}
      </div>

      {/* Add Post Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Create New Post</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Post title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select
                    value={newPost.platform}
                    onChange={(e) => setNewPost({...newPost, platform: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newPost.time}
                    onChange={(e) => setNewPost({...newPost, time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newPost.description}
                    onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Post description..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="4"
                    placeholder="Write your post content here..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={addPost}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Create Post
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendarTemplate;