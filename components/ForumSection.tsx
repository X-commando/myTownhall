'use client';

import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Plus, Tag, User, Calendar } from 'lucide-react';
import { ForumThread } from '@/lib/mockData';
import { format } from 'date-fns';

interface ForumSectionProps {
  threads: ForumThread[];
  municipalityId: string;
}

export default function ForumSection({ threads, municipalityId }: ForumSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const allTags = ['Budget', 'Board', 'Help Requests', 'Miscellaneous'];
  const filteredThreads = selectedTag === 'all' 
    ? threads 
    : threads.filter(thread => thread.tags.includes(selectedTag));

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Creating thread:', newThread);
    setShowNewThreadForm(false);
    setNewThread({ title: '', content: '', tags: [] });
  };

  const handleTagToggle = (tag: string) => {
    setNewThread(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary-custom mb-2">Community Forum</h2>
          <p className="text-gray-600">Discuss local issues and connect with your community</p>
        </div>
        <button
          onClick={() => setShowNewThreadForm(true)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Thread</span>
        </button>
      </div>

      {/* Tag Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-primary-custom mb-4">Filter by Topic</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedTag === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Topics
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Thread List */}
      <div className="space-y-4">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <div key={thread.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary-custom mb-2">
                    {thread.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{thread.content}</p>
                  
                  {/* Tags */}
                  <div className="flex items-center space-x-2 mb-4">
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{thread.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(thread.createdAt, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.comments.length} comments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{thread.upvotes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm font-medium">{thread.downvotes}</span>
                  </button>
                </div>
                <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                  View Discussion
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No threads found</h3>
            <p className="text-gray-500">Be the first to start a discussion in this topic!</p>
          </div>
        )}
      </div>

      {/* New Thread Modal */}
      {showNewThreadForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleCreateThread} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-primary-custom">Create New Thread</h3>
                <button
                  type="button"
                  onClick={() => setShowNewThreadForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thread Title
                  </label>
                  <input
                    type="text"
                    value={newThread.title}
                    onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter thread title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newThread.content}
                    onChange={(e) => setNewThread(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Share your thoughts or questions..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          newThread.tags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewThreadForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  Create Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}