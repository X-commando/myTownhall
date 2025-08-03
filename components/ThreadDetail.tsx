'use client';

import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, User, Calendar, Send } from 'lucide-react';
import { format } from 'date-fns';
import { vote, addComment } from '@/lib/api';

interface ThreadDetailProps {
  thread: any;
  onClose: () => void;
}

export default function ThreadDetail({ thread, onClose }: ThreadDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({
        content: newComment,
        author: 'Anonymous User',
        threadId: thread.id
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (voteType: 'up' | 'down', commentId?: string) => {
    try {
      if (commentId) {
        await vote({ commentId, voteType });
      } else {
        await vote({ threadId: thread.id, voteType });
      }
      window.location.reload();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary-custom mb-2">
                {thread.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{thread.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(thread.createdAt), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Thread Content */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{thread.content}</p>
            
            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Vote buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleVote('up')}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700"
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">{thread.upvotes}</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <ThumbsDown className="w-5 h-5" />
                <span className="font-medium">{thread.downvotes}</span>
              </button>
            </div>
          </div>

          <hr className="my-6" />

          {/* Comments Section */}
          <div>
            <h3 className="text-lg font-semibold text-primary-custom mb-4">
              Comments ({thread.Comment?.length || 0})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {thread.Comment && thread.Comment.length > 0 ? (
                thread.Comment.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{comment.author}</span>
                        <span>•</span>
                        <span>{format(new Date(comment.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleVote('up', comment.id)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.upvotes}</span>
                      </button>
                      <button
                        onClick={() => handleVote('down', comment.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{comment.downvotes}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}