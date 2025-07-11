'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, FileText } from 'lucide-react';
import { Meeting } from '@/lib/mockData';
import { format } from 'date-fns';

interface MeetingsSectionProps {
  meetings: Meeting[];
}

export default function MeetingsSection({ meetings }: MeetingsSectionProps) {
  const [selectedCommittee, setSelectedCommittee] = useState<string>('all');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const committees = ['all', ...Array.from(new Set(meetings.map(m => m.committee)))];
  const filteredMeetings = selectedCommittee === 'all' 
    ? meetings 
    : meetings.filter(m => m.committee === selectedCommittee);

  const upcomingMeetings = filteredMeetings.filter(m => m.status === 'upcoming');
  const pastMeetings = filteredMeetings.filter(m => m.status === 'past');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary-custom mb-4">Board Meetings</h2>
        <p className="text-gray-600">Stay informed about government meetings and decisions</p>
      </div>

      {/* Committee Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-primary-custom mb-4">Filter by Committee</h3>
        <div className="flex flex-wrap gap-2">
          {committees.map((committee) => (
            <button
              key={committee}
              onClick={() => setSelectedCommittee(committee)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCommittee === committee
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {committee === 'all' ? 'All Committees' : committee}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Meetings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary-custom">Upcoming Meetings</h3>
          </div>
          
          <div className="space-y-4">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-custom mb-1">
                        {meeting.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(meeting.date, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{meeting.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-primary font-medium">{meeting.committee}</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Upcoming
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming meetings scheduled</p>
            )}
          </div>
        </div>

        {/* Past Meetings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-primary-custom">Past Meetings</h3>
          </div>
          
          <div className="space-y-4">
            {pastMeetings.length > 0 ? (
              pastMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-custom mb-1">
                        {meeting.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(meeting.date, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{meeting.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600">{meeting.committee}</span>
                      </div>
                    </div>
                    <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      Past
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No past meetings available</p>
            )}
          </div>
        </div>
      </div>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary-custom mb-2">
                    {selectedMeeting.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(selectedMeeting.date, 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedMeeting.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{selectedMeeting.committee}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-primary-custom mb-3">Agenda</h4>
                <ul className="space-y-2">
                  {selectedMeeting.agenda.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-primary font-medium">{index + 1}.</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}