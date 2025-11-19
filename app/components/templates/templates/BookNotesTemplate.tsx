import React, { useState } from 'react';
import { 
  ChevronLeft, BookOpen, Star, Plus, MoreVertical, Edit3, Trash2, 
  Search, Filter, Quote, Calendar, BarChart3, Target, Bookmark,
  X, Save, User, Clock, Eye, CheckCircle  // ✅ Added CheckCircle here
} from 'lucide-react';

const BookNotesTemplate = ({ setView, onSave }) => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      rating: 5,
      status: 'Completed',
      category: 'Productivity',
      pages: 320,
      currentPage: 320,
      notes: 'Key insight: Small changes compound over time. Focus on systems, not goals. The 1% better every day concept is powerful for long-term growth.',
      quotes: [
        'You do not rise to the level of your goals, you fall to the level of your systems.',
        'Every action you take is a vote for the type of person you wish to become.',
        'Habits are the compound interest of self-improvement.'
      ],
      keyInsights: [
        'The Four Laws of Behavior Change: Make it obvious, attractive, easy, and satisfying',
        'Environment design is more important than motivation',
        'Habit stacking helps build new routines'
      ],
      dateStarted: '2025-10-01',
      dateFinished: '2025-10-15',
      readingTime: '2 weeks',
      coverColor: 'from-blue-500 to-cyan-600'
    },
    {
      id: 2,
      title: 'Deep Work',
      author: 'Cal Newport',
      rating: 4,
      status: 'Reading',
      category: 'Productivity',
      pages: 296,
      currentPage: 150,
      notes: 'Focused attention is a superpower in the modern economy. The ability to work without distraction is becoming increasingly valuable.',
      quotes: [
        'The ability to perform deep work is becoming increasingly rare and valuable.',
        'Deep work is like a superpower in our increasingly competitive economy.',
        'The key to developing a deep work habit is to move beyond good intentions.'
      ],
      keyInsights: [
        'Four approaches to deep work: monastic, bimodal, rhythmic, journalistic',
        'Schedule every minute of your day',
        'Embrace boredom and quit social media'
      ],
      dateStarted: '2025-11-01',
      dateFinished: null,
      readingTime: '1 week so far',
      coverColor: 'from-purple-500 to-indigo-600'
    },
    {
      id: 3,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      rating: 5,
      status: 'Completed',
      category: 'Finance',
      pages: 252,
      currentPage: 252,
      notes: 'Financial success is not a hard science but a soft skill where how you behave is more important than what you know.',
      quotes: [
        'Financial success is not a hard science. It\'s a soft skill, where how you behave is more important than what you know.',
        'The highest form of wealth is the ability to wake up every morning and say, "I can do whatever I want today."',
        'Controlling your time is the highest dividend money pays.'
      ],
      keyInsights: [
        'Luck and risk are siblings',
        'Wealth is what you don\'t see',
        'Reasonable > Rational'
      ],
      dateStarted: '2025-09-15',
      dateFinished: '2025-09-25',
      readingTime: '10 days',
      coverColor: 'from-green-500 to-emerald-600'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    rating: 0,
    status: 'Planning',
    category: 'Productivity',
    pages: '',
    currentPage: '',
    notes: '',
    quotes: [''],
    keyInsights: [''],
    dateStarted: new Date().toISOString().split('T')[0],
    dateFinished: ''
  });

  const categories = ['Productivity', 'Finance', 'Fiction', 'Science', 'Psychology', 'Business', 'Health', 'Philosophy'];
  const statuses = ['Planning', 'Reading', 'Completed', 'On Hold'];

  const getProgressPercentage = (book) => {
    return Math.round((book.currentPage / book.pages) * 100);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-700 border-green-200',
      'Reading': 'bg-blue-100 text-blue-700 border-blue-200',
      'Planning': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'On Hold': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Productivity': 'bg-blue-100 text-blue-700',
      'Finance': 'bg-green-100 text-green-700',
      'Fiction': 'bg-purple-100 text-purple-700',
      'Science': 'bg-orange-100 text-orange-700',
      'Psychology': 'bg-pink-100 text-pink-700',
      'Business': 'bg-indigo-100 text-indigo-700',
      'Health': 'bg-red-100 text-red-700',
      'Philosophy': 'bg-cyan-100 text-cyan-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const addBook = () => {
    if (!newBook.title.trim() || !newBook.author.trim()) return;

    const book = {
      id: Date.now(),
      ...newBook,
      pages: parseInt(newBook.pages) || 0,
      currentPage: parseInt(newBook.currentPage) || 0,
      readingTime: 'Just started',
      coverColor: 'from-gray-500 to-gray-600',
      quotes: newBook.quotes.filter(quote => quote.trim()),
      keyInsights: newBook.keyInsights.filter(insight => insight.trim())
    };

    setBooks([...books, book]);
    setNewBook({
      title: '',
      author: '',
      rating: 0,
      status: 'Planning',
      category: 'Productivity',
      pages: '',
      currentPage: '',
      notes: '',
      quotes: [''],
      keyInsights: [''],
      dateStarted: new Date().toISOString().split('T')[0],
      dateFinished: ''
    });
    setShowAddForm(false);
  };

  const deleteBook = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId));
    setDropdownOpen(null);
  };

  const updateBookProgress = (bookId, currentPage) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { ...book, currentPage: Math.min(currentPage, book.pages) }
        : book
    ));
  };

  const addQuote = () => {
    setNewBook({...newBook, quotes: [...newBook.quotes, '']});
  };

  const updateQuote = (index, value) => {
    const newQuotes = [...newBook.quotes];
    newQuotes[index] = value;
    setNewBook({...newBook, quotes: newQuotes});
  };

  const removeQuote = (index) => {
    const newQuotes = newBook.quotes.filter((_, i) => i !== index);
    setNewBook({...newBook, quotes: newQuotes});
  };

  const addInsight = () => {
    setNewBook({...newBook, keyInsights: [...newBook.keyInsights, '']});
  };

  const updateInsight = (index, value) => {
    const newInsights = [...newBook.keyInsights];
    newInsights[index] = value;
    setNewBook({...newBook, keyInsights: newInsights});
  };

  const removeInsight = (index) => {
    const newInsights = newBook.keyInsights.filter((_, i) => i !== index);
    setNewBook({...newBook, keyInsights: newInsights});
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    totalBooks: books.length,
    completed: books.filter(b => b.status === 'Completed').length,
    inProgress: books.filter(b => b.status === 'Reading').length,
    totalPages: books.reduce((sum, book) => sum + book.pages, 0),
    averageRating: (books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1) || 0
  };

  const BookForm = ({ book = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState(book || newBook);

    const handleSubmit = () => {
      if (book) {
        onSave({ ...book, ...formData });
      } else {
        addBook();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{book ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Book title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Author name"
                  />
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({...formData, pages: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="320"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Page</label>
                  <input
                    type="number"
                    value={formData.currentPage}
                    onChange={(e) => setFormData({...formData, currentPage: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="150"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFormData({...formData, rating: star})}
                      className="p-1"
                    >
                      <Star 
                        size={20} 
                        className={star <= formData.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Summary</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Write your thoughts, key takeaways, and summary..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Key Quotes</label>
                  <button
                    type="button"
                    onClick={addQuote}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    + Add Quote
                  </button>
                </div>
                {formData.quotes.map((quote, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={quote}
                      onChange={(e) => updateQuote(index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter a memorable quote..."
                    />
                    {formData.quotes.length > 1 && (
                      <button
                        onClick={() => removeQuote(index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Key Insights</label>
                  <button
                    type="button"
                    onClick={addInsight}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    + Add Insight
                  </button>
                </div>
                {formData.keyInsights.map((insight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={insight}
                      onChange={(e) => updateInsight(index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter a key insight or lesson..."
                    />
                    {formData.keyInsights.length > 1 && (
                      <button
                        onClick={() => removeInsight(index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {book ? 'Update Book' : 'Add Book'}
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
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Book Notes</h1>
                  <p className="text-sm text-gray-600">Track your reading journey and insights</p>
                </div>
              </div>
            </div>
            <button onClick={() => onSave({ books })} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Save to workspace
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold">{stats.totalBooks}</p>
              </div>
              <BookOpen className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <Target className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold">{stats.totalPages.toLocaleString()}</p>
              </div>
              <Bookmark className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating}/5</p>
              </div>
              <Star className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search books, authors, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Filters */}
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

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 w-fit"
          >
            <Plus size={16} />
            Add New Book
          </button>
        </div>

        {/* Books Grid */}
        <div className="space-y-6">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Book Cover */}
                <div className={`w-24 h-32 rounded-lg bg-gradient-to-br ${book.coverColor} flex items-center justify-center flex-shrink-0`}>
                  <BookOpen className="text-white" size={32} />
                </div>

                {/* Book Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{book.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(book.status)}`}>
                          {book.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">by {book.author}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className={i < book.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{book.rating}/5</span>
                        </div>
                        
                        <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(book.category)}`}>
                          {book.category}
                        </span>
                        
                        <span className="text-sm text-gray-600">
                          {book.currentPage}/{book.pages} pages
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {book.status === 'Reading' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{getProgressPercentage(book)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${getProgressPercentage(book)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative flex-shrink-0">
                      <button 
                        onClick={() => setDropdownOpen(dropdownOpen === book.id ? null : book.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {dropdownOpen === book.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                          <button 
                            onClick={() => setEditingBook(book)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteBook(book.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Bookmark size={14} />
                        Notes & Summary
                      </h4>
                      <p className="text-gray-600 leading-relaxed">{book.notes}</p>
                    </div>

                    {book.keyInsights && book.keyInsights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Target size={14} />
                          Key Insights
                        </h4>
                        <ul className="space-y-2">
                          {book.keyInsights.map((insight, i) => (
                            <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {book.quotes && book.quotes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Quote size={14} />
                          Memorable Quotes
                        </h4>
                        <div className="space-y-3">
                          {book.quotes.map((quote, i) => (
                            <div key={i} className="pl-4 border-l-4 border-orange-400 italic text-gray-600">
                              "{quote}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reading Timeline */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {book.dateStarted && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Started: {book.dateStarted}
                        </span>
                      )}
                      {book.dateFinished && (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={14} /> {/* ✅ Fixed: Now CheckCircle is imported */}
                          Finished: {book.dateFinished}
                        </span>
                      )}
                      {book.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {book.readingTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mt-4">No books found</h3>
            <p className="text-gray-600 mt-2">Start building your reading library</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Add Your First Book
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Book Modal */}
      {(showAddForm || editingBook) && (
        <BookForm
          book={editingBook}
          onSave={(updatedBook) => {
            setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
            setEditingBook(null);
          }}
          onCancel={() => {
            setShowAddForm(false);
            setEditingBook(null);
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

export default BookNotesTemplate;