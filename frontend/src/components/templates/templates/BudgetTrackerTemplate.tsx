import React, { useState } from 'react';
import { 
  ChevronLeft, Plus, MoreVertical, Edit3, Trash2, 
  DollarSign, TrendingUp, TrendingDown, Wallet, Calendar,
  Search, Filter, PieChart, BarChart3, CreditCard,
  X, Save, Home, Utensils, Car, ShoppingBag, Heart,
  GraduationCap, Plane, Wifi, Coffee
} from 'lucide-react';

const BudgetTrackerTemplate = ({ setView, onSave }) => {
  const [activeView, setActiveView] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'expense',
      category: 'food',
      amount: 45.50,
      description: 'Groceries at Whole Foods',
      date: '2025-01-15',
      paymentMethod: 'credit_card'
    },
    {
      id: 2,
      type: 'income',
      category: 'salary',
      amount: 3200.00,
      description: 'Monthly Salary',
      date: '2025-01-01',
      paymentMethod: 'bank_transfer'
    },
    {
      id: 3,
      type: 'expense',
      category: 'transport',
      amount: 85.00,
      description: 'Gas for car',
      date: '2025-01-14',
      paymentMethod: 'debit_card'
    },
    {
      id: 4,
      type: 'expense',
      category: 'entertainment',
      amount: 32.00,
      description: 'Netflix Subscription',
      date: '2025-01-10',
      paymentMethod: 'credit_card'
    },
    {
      id: 5,
      type: 'expense',
      category: 'utilities',
      amount: 120.50,
      description: 'Electricity Bill',
      date: '2025-01-05',
      paymentMethod: 'bank_transfer'
    }
  ]);

  const [budgets, setBudgets] = useState([
    { category: 'food', limit: 600, spent: 245 },
    { category: 'transport', limit: 300, spent: 185 },
    { category: 'entertainment', limit: 150, spent: 95 },
    { category: 'utilities', limit: 400, spent: 320 }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: 'food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  });

  // Categories with icons and colors
  const categories = {
    income: [
      { id: 'salary', name: 'Salary', icon: <DollarSign size={16} />, color: 'bg-green-100 text-green-700' },
      { id: 'freelance', name: 'Freelance', icon: <TrendingUp size={16} />, color: 'bg-blue-100 text-blue-700' },
      { id: 'investment', name: 'Investment', icon: <BarChart3 size={16} />, color: 'bg-purple-100 text-purple-700' }
    ],
    expense: [
      { id: 'food', name: 'Food & Dining', icon: <Utensils size={16} />, color: 'bg-red-100 text-red-700' },
      { id: 'transport', name: 'Transport', icon: <Car size={16} />, color: 'bg-orange-100 text-orange-700' },
      { id: 'entertainment', name: 'Entertainment', icon: <ShoppingBag size={16} />, color: 'bg-pink-100 text-pink-700' },
      { id: 'utilities', name: 'Utilities', icon: <Wifi size={16} />, color: 'bg-indigo-100 text-indigo-700' },
      { id: 'healthcare', name: 'Healthcare', icon: <Heart size={16} />, color: 'bg-rose-100 text-rose-700' },
      { id: 'education', name: 'Education', icon: <GraduationCap size={16} />, color: 'bg-cyan-100 text-cyan-700' },
      { id: 'travel', name: 'Travel', icon: <Plane size={16} />, color: 'bg-amber-100 text-amber-700' },
      { id: 'coffee', name: 'Coffee', icon: <Coffee size={16} />, color: 'bg-brown-100 text-brown-700' }
    ]
  };

  const paymentMethods = [
    { id: 'cash', name: 'Cash' },
    { id: 'credit_card', name: 'Credit Card' },
    { id: 'debit_card', name: 'Debit Card' },
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'paypal', name: 'PayPal' }
  ];

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Expenses by category for charts
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add new transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) return;

    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      type: 'expense',
      category: 'food',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash'
    });
    setShowAddModal(false);
  };

  // Delete transaction
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setDropdownOpen(null);
  };

  // Get category info
  const getCategoryInfo = (categoryId) => {
    const allCategories = [...categories.income, ...categories.expense];
    return allCategories.find(cat => cat.id === categoryId) || { name: 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  // Get payment method name
  const getPaymentMethodName = (methodId) => {
    return paymentMethods.find(m => m.id === methodId)?.name || methodId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Wallet className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Budget Tracker</h1>
                  <p className="text-sm text-gray-600">Manage your finances effectively</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onSave({ transactions, budgets })}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Save to Workspace
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${balance.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Wallet className="text-gray-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="text-red-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* View Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'overview' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('transactions')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'transactions' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveView('budgets')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'budgets' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Budgets
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-64"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="all">All Categories</option>
              <optgroup label="Income">
                {categories.income.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </optgroup>
              <optgroup label="Expenses">
                {categories.expense.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors w-fit"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>

        {/* Content Area */}
        {activeView === 'transactions' && (
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Transactions</h2>
            </div>

            {/* Transactions List */}
            <div className="divide-y">
              {filteredTransactions.map((transaction) => {
                const categoryInfo = getCategoryInfo(transaction.category);
                return (
                  <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                          {categoryInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {transaction.description}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {transaction.date}
                            </span>
                            <span>{categoryInfo.name}</span>
                            <span>{getPaymentMethodName(transaction.paymentMethod)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-lg font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setDropdownOpen(dropdownOpen === transaction.id ? null : transaction.id)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {dropdownOpen === transaction.id && (
                            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50">
                                <Edit3 size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTransaction(transaction.id)}
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
                  </div>
                );
              })}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-gray-400" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mt-4">No transactions found</h3>
                <p className="text-gray-600 mt-2">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try changing your search or filters' 
                    : 'Get started by adding your first transaction'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <button 
                  onClick={() => setActiveView('transactions')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => {
                  const categoryInfo = getCategoryInfo(transaction.category);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                          {categoryInfo.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{categoryInfo.name}</div>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const categoryInfo = getCategoryInfo(budget.category);
                  const percentage = (budget.spent / budget.limit) * 100;
                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${categoryInfo.color}`}>
                            {categoryInfo.icon}
                          </div>
                          <span className="font-medium text-gray-900">{categoryInfo.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          ${budget.spent} / ${budget.limit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentage > 90 ? 'bg-red-500' :
                            percentage > 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Transaction</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <optgroup label="Income">
                      {categories.income.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Expenses">
                      {categories.expense.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="What was this for?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={newTransaction.paymentMethod}
                    onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>{method.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Add Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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

export default BudgetTrackerTemplate;