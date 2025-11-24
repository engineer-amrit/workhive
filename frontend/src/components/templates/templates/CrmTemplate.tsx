import React, { useState } from 'react';
import { ChevronLeft, Plus, Users, DollarSign, TrendingUp, Mail, Phone, Building, Search, X, Edit2, Trash2, Save, MessageSquare, Clock, Filter, Download, Upload } from 'lucide-react';

const CRMTemplate = ({ setView, onSave }) => {
  const [contacts, setContacts] = useState([
    { 
      id: 1, 
      name: 'John Smith', 
      company: 'Tech Corp', 
      email: 'john@techcorp.com', 
      phone: '+1 234-567-8900', 
      status: 'Lead', 
      value: '$50,000', 
      lastContact: '2025-11-10',
      notes: 'Interested in enterprise plan. Follow up next week.',
      activities: [
        { id: 1, type: 'email', description: 'Sent proposal', date: '2025-11-10' },
        { id: 2, type: 'call', description: 'Initial discovery call', date: '2025-11-05' }
      ]
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      company: 'Design Studio', 
      email: 'sarah@designstudio.com', 
      phone: '+1 234-567-8901', 
      status: 'Qualified', 
      value: '$75,000', 
      lastContact: '2025-11-09',
      notes: 'Budget approved. Waiting for final decision.',
      activities: [
        { id: 3, type: 'meeting', description: 'Demo session', date: '2025-11-09' }
      ]
    },
    { 
      id: 3, 
      name: 'Mike Davis', 
      company: 'Marketing Inc', 
      email: 'mike@marketing.com', 
      phone: '+1 234-567-8902', 
      status: 'Proposal', 
      value: '$100,000', 
      lastContact: '2025-11-11',
      notes: 'Requested custom pricing. Deadline: Nov 20',
      activities: []
    },
    { 
      id: 4, 
      name: 'Emily Chen', 
      company: 'Startup XYZ', 
      email: 'emily@startup.xyz', 
      phone: '+1 234-567-8903', 
      status: 'Negotiation', 
      value: '$120,000', 
      lastContact: '2025-11-11',
      notes: 'Negotiating contract terms. Close expected this week.',
      activities: []
    },
    { 
      id: 5, 
      name: 'David Wilson', 
      company: 'Enterprise Solutions', 
      email: 'david@enterprise.com', 
      phone: '+1 234-567-8904', 
      status: 'Closed Won', 
      value: '$200,000', 
      lastContact: '2025-10-28',
      notes: 'Deal closed! Onboarding scheduled for Dec 1.',
      activities: []
    }
  ]);

  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [newContact, setNewContact] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead',
    value: '',
    notes: ''
  });

  const [newActivity, setNewActivity] = useState({ type: 'email', description: '' });
  const [newNote, setNewNote] = useState('');

  const statuses = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Lead': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Qualified': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Proposal': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Negotiation': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Closed Won': return 'bg-green-100 text-green-700 border-green-300';
      case 'Closed Lost': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Add Contact
  const addContact = () => {
    if (newContact.name.trim() && newContact.company.trim()) {
      setContacts([...contacts, {
        id: Date.now(),
        name: newContact.name,
        company: newContact.company,
        email: newContact.email,
        phone: newContact.phone,
        status: newContact.status,
        value: newContact.value || '$0',
        lastContact: new Date().toISOString().split('T')[0],
        notes: newContact.notes,
        activities: []
      }]);
      
      setNewContact({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'Lead',
        value: '',
        notes: ''
      });
      
      setShowAddContact(false);
    }
  };

  // Update Contact
  const updateContact = (updatedContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    setEditingContact(null);
    if (selectedContact?.id === updatedContact.id) {
      setSelectedContact(updatedContact);
    }
  };

  // Delete Contact
  const deleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(c => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    }
  };

  // Update Status
  const updateStatus = (contactId, newStatus) => {
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, status: newStatus, lastContact: new Date().toISOString().split('T')[0] } : c
    ));
    if (selectedContact?.id === contactId) {
      setSelectedContact({ ...selectedContact, status: newStatus });
    }
  };

  // Add Activity
  const addActivity = (contactId) => {
    if (newActivity.description.trim()) {
      setContacts(contacts.map(c => {
        if (c.id === contactId) {
          return {
            ...c,
            activities: [
              { id: Date.now(), ...newActivity, date: new Date().toISOString().split('T')[0] },
              ...c.activities
            ],
            lastContact: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      }));
      
      if (selectedContact?.id === contactId) {
        const updated = contacts.find(c => c.id === contactId);
        setSelectedContact({
          ...selectedContact,
          activities: [
            { id: Date.now(), ...newActivity, date: new Date().toISOString().split('T')[0] },
            ...selectedContact.activities
          ]
        });
      }
      
      setNewActivity({ type: 'email', description: '' });
    }
  };

  // Update Notes
  const updateNotes = (contactId, notes) => {
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, notes } : c
    ));
    if (selectedContact?.id === contactId) {
      setSelectedContact({ ...selectedContact, notes });
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const csv = [
      ['Name', 'Company', 'Email', 'Phone', 'Status', 'Value', 'Last Contact'],
      ...contacts.map(c => [c.name, c.company, c.email, c.phone, c.status, c.value, c.lastContact])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
  };

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalValue = contacts.reduce((sum, c) => {
    const value = parseInt(c.value.replace(/[$,]/g, ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = contacts.filter(c => c.status === status).length;
    return acc;
  }, {});

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
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white text-xl">
                  👥
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">CRM</h1>
                  <p className="text-sm text-gray-500">{contacts.length} contacts</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Export CSV
              </button>
              
              <button 
                onClick={() => onSave({ contacts })}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Contacts</span>
              <Users className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{contacts.length}</div>
            <div className="text-sm text-gray-500 mt-1">
              {contacts.filter(c => !c.status.includes('Closed')).length} active
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Pipeline Value</span>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${(totalValue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total potential revenue
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Deals</span>
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {contacts.filter(c => !c.status.includes('Closed')).length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              In progress
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Won Deals</span>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {statusCounts['Closed Won'] || 0}
            </div>
            <div className="text-sm text-green-600 mt-1">
              {statusCounts['Closed Won'] > 0 ? `${((statusCounts['Closed Won'] / contacts.length) * 100).toFixed(0)}% win rate` : 'No wins yet'}
            </div>
          </div>
        </div>

        {/* Pipeline View */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
            <div className="text-sm text-gray-500">
              Click on a stage to filter contacts
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {statuses.map(status => {
                const statusContacts = contacts.filter(c => c.status === status);
                const statusValue = statusContacts.reduce((sum, c) => {
                  const value = parseInt(c.value.replace(/[$,]/g, ''));
                  return sum + (isNaN(value) ? 0 : value);
                }, 0);

                return (
                  <div 
                    key={status} 
                    className="flex-shrink-0 w-48 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
                  >
                    <div className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 mb-3 ${
                      filterStatus === status ? 'ring-2 ring-blue-500' : ''
                    } ${getStatusColor(status)}`}>
                      {status} ({statusContacts.length})
                    </div>
                    <div className="text-xs text-gray-600 mb-2 font-medium">
                      ${(statusValue / 1000).toFixed(0)}K total
                    </div>
                    <div className="h-24 bg-gray-100 rounded-lg relative overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 transition-all"
                        style={{ height: totalValue > 0 ? `${(statusValue / totalValue) * 100}%` : '0%' }}
                      />
                    </div>
                    {statusContacts.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        Avg: ${(statusValue / statusContacts.length / 1000).toFixed(0)}K
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

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

            {(searchQuery || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          <button 
            onClick={() => setShowAddContact(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContacts.map(contact => (
                  <tr
                    key={contact.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Mail size={12} />
                          {contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{contact.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={contact.status}
                        onChange={(e) => updateStatus(contact.id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full font-medium border-2 cursor-pointer ${getStatusColor(contact.status)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{contact.value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{contact.lastContact}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedContact(contact)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => setEditingContact(contact)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteContact(contact.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No contacts found</p>
              {(searchQuery || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="mt-3 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">Add New Contact</h3>
              <button
                onClick={() => setShowAddContact(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    placeholder="Tech Corp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="john@techcorp.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+1 234-567-8900"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newContact.status}
                    onChange={(e) => setNewContact({ ...newContact, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Value
                  </label>
                  <input
                    type="text"
                    value={newContact.value}
                    onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                    placeholder="$50,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newContact.notes}
                    onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                    placeholder="Add any relevant notes..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addContact}
                  disabled={!newContact.name.trim() || !newContact.company.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">Edit Contact</h3>
              <button
                onClick={() => setEditingContact(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={editingContact.company}
                    onChange={(e) => setEditingContact({ ...editingContact, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingContact.email}
                    onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingContact.phone}
                    onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingContact.status}
                    onChange={(e) => setEditingContact({ ...editingContact, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
                  <input
                    type="text"
                    value={editingContact.value}
                    onChange={(e) => setEditingContact({ ...editingContact, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingContact(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateContact(editingContact)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h3>
                <p className="text-gray-600 mt-1">{selectedContact.company}</p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-600" size={20} />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium text-gray-900">{selectedContact.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-600" size={20} />
                  <div>
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">{selectedContact.phone}</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 mb-1">Status</div>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateStatus(selectedContact.id, e.target.value)}
                    className={`font-semibold text-sm px-2 py-1 rounded border-2 ${getStatusColor(selectedContact.status)}`}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-xs text-green-600 mb-1">Deal Value</div>
                  <div className="font-semibold text-green-900">{selectedContact.value}</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-xs text-purple-600 mb-1">Last Contact</div>
                  <div className="font-semibold text-purple-900">{selectedContact.lastContact}</div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare size={18} />
                    Notes
                  </h4>
                </div>
                <textarea
                  value={selectedContact.notes || ''}
                  onChange={(e) => updateNotes(selectedContact.id, e.target.value)}
                  placeholder="Add notes about this contact..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Activity Log */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock size={18} />
                    Activity Log
                  </h4>
                </div>
                
                {/* Add Activity */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-2">
                    <select
                      value={newActivity.type}
                      onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="email">Email</option>
                      <option value="call">Call</option>
                      <option value="meeting">Meeting</option>
                      <option value="note">Note</option>
                    </select>
                    <input
                      type="text"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      placeholder="Add activity description..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && addActivity(selectedContact.id)}
                    />
                    <button
                      onClick={() => addActivity(selectedContact.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Activity List */}
                <div className="space-y-3">
                  {selectedContact.activities && selectedContact.activities.length > 0 ? (
                    selectedContact.activities.map(activity => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'call' ? 'bg-green-100 text-green-600' :
                          activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.type[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.date} • {activity.type}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <Clock size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No activities yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <button 
                  onClick={() => {
                    setEditingContact(selectedContact);
                    setSelectedContact(null);
                  }}
                  className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit Contact
                </button>
                <button 
                  onClick={() => {
                    deleteContact(selectedContact.id);
                  }}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMTemplate;