'use client';

import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Plus, Tag, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { createForumThread, vote } from '@/lib/api';
import ThreadDetail from './ThreadDetail';

interface ForumSectionProps {
  threads: any[];
  municipalityId: string;
}

export default function ForumSection({ threads, municipalityId }: ForumSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const allTags = ['Budget', 'Board', 'Help Requests', 'Miscellaneous'];
  
  // Filter threads by selected tag
  const filteredThreads = selectedTag === 'all' 
    ? threads 
    : threads.filter(thread => 
        thread.ThreadTag && thread.ThreadTag.some((tag: any) => 
          tag.name === selectedTag
        )
      );

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate municipality ID
    if (!municipalityId) {
      alert('Error: Municipality ID is missing. Please refresh the page.');
      return;
    }

    // Validate form data
    if (!newThread.title.trim() || !newThread.content.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Creating thread with municipality ID:', municipalityId);
      
      await createForumThread({
        title: newThread.title.trim(),
        content: newThread.content.trim(),
        author: 'Anonymous User',
        municipalityId: municipalityId,
        tags: newThread.tags
      });
      
      // Success - refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Failed to create thread. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setNewThread(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleThreadVote = async (threadId: string, voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening thread detail
    
    try {
      await vote({ threadId, voteType });
      window.location.reload();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  // Format date safely
  const formatDate = (date: any) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Unknown date';
    }
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
          disabled={!municipalityId}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>New Thread</span>
        </button>
      </div>

      {/* Show error if no municipality ID */}
      {!municipalityId && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error: Municipality data is missing. Please refresh the page.
        </div>
      )}

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
            <div key={thread.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary-custom mb-2">
                    {thread.title}
                  </h3>
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {thread.content}
                  </p>
                  
                  {/* Tags */}
                  {thread.ThreadTag && thread.ThreadTag.length > 0 && (
                    <div className="flex items-center flex-wrap gap-2 mb-4">
                      {thread.ThreadTag.map((tag: any, index: number) => (
                        <span
                          key={tag.id || `${thread.id}-tag-${index}`}
                          className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{tag.name}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{thread.author || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(thread.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.Comment?.length || 0} comments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={(e) => handleThreadVote(thread.id, 'up', e)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors group"
                  >
                    <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{thread.upvotes || 0}</span>
                  </button>
                  <button 
                    onClick={(e) => handleThreadVote(thread.id, 'down', e)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors group"
                  >
                    <ThumbsDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{thread.downvotes || 0}</span>
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedThread(thread)}
                  className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center gap-1 group"
                >
                  View Discussion
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No threads found</h3>
            <p className="text-gray-500">
              {selectedTag === 'all' 
                ? 'Be the first to start a discussion!' 
                : `No threads found with the "${selectedTag}" tag.`}
            </p>
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
                  onClick={() => {
                    setShowNewThreadForm(false);
                    setNewThread({ title: '', content: '', tags: [] });
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thread Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newThread.title}
                    onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter thread title..."
                    required
                    disabled={isSubmitting}
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newThread.content}
                    onChange={(e) => setNewThread(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Share your thoughts or questions..."
                    required
                    disabled={isSubmitting}
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newThread.content.length}/2000 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (select at least one)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        disabled={isSubmitting}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          newThread.tags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  onClick={() => {
                    setShowNewThreadForm(false);
                    setNewThread({ title: '', content: '', tags: [] });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newThread.title.trim() || !newThread.content.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Thread'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thread Detail Modal */}
      {selectedThread && (
        <ThreadDetail
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
        />
      )}
    </div>
  );
}