import React, { useState } from 'react';
import { ChevronLeft, Plus, Calendar, Users, CheckSquare, Trash2 } from 'lucide-react';

const MeetingNotesTemplate = ({ setView, onSave }) => {
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Q4 Planning Meeting',
      date: '2025-11-15',
      attendees: ['You', 'Sarah', 'Mike'],
      notes: 'Discussed Q4 objectives and key deliverables.',
      actionItems: [
        { id: 1, text: 'Draft project timeline', assignee: 'You', completed: false },
        { id: 2, text: 'Review budget allocation', assignee: 'Sarah', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Client Presentation',
      date: '2025-11-12',
      attendees: ['You', 'John'],
      notes: 'Presented new design concepts. Client approved option B.',
      actionItems: [
        { id: 3, text: 'Finalize design mockups', assignee: 'You', completed: true },
        { id: 4, text: 'Send contract for review', assignee: 'John', completed: false }
      ]
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', attendees: '', notes: '' });
  const [showNewMeeting, setShowNewMeeting] = useState(false);

  const addMeeting = () => {
    if (newMeeting.title.trim()) {
      setMeetings([...meetings, {
        id: Date.now(),
        ...newMeeting,
        attendees: newMeeting.attendees.split(',').map(a => a.trim()),
        actionItems: []
      }]);
      setNewMeeting({ title: '', date: '', attendees: '', notes: '' });
      setShowNewMeeting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-xl">📝</div>
                <h1 className="text-2xl font-semibold">Meeting Notes</h1>
              </div>
            </div>
            <button onClick={() => onSave({ meetings })} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Save to workspace
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Meetings</h2>
          <button onClick={() => setShowNewMeeting(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Plus size={18} /> New Meeting
          </button>
        </div>

        <div className="space-y-4">
          {meetings.map(meeting => (
            <div key={meeting.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {meeting.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {meeting.attendees.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <p className="text-gray-600">{meeting.notes}</p>
              </div>

              {meeting.actionItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CheckSquare size={14} /> Action Items
                  </h4>
                  <div className="space-y-2">
                    {meeting.actionItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <input type="checkbox" checked={item.completed} readOnly className="w-4 h-4" />
                        <span className={item.completed ? 'line-through text-gray-400' : ''}>{item.text}</span>
                        <span className="text-sm text-gray-500 ml-auto">@{item.assignee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {showNewMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <h3 className="text-xl font-semibold mb-4">New Meeting</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="Meeting title..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={newMeeting.attendees}
                  onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                  placeholder="Attendees (comma-separated)..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  value={newMeeting.notes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  placeholder="Meeting notes..."
                  className="w-full px-3 py-2 border rounded-lg h-32"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowNewMeeting(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addMeeting} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingNotesTemplate;