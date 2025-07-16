// Helper functions to talk to our database

// Get all towns
export async function getTowns() {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/towns`);
    if (!response.ok) throw new Error('Failed to fetch towns');
    return await response.json();
  } catch (error) {
    console.error('Error fetching towns:', error);
    return [];
  }
}

// Get one specific town
export async function getTown(slug: string) {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/towns/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch town');
    return await response.json();
  } catch (error) {
    console.error('Error fetching town:', error);
    return null;
  }
}

// Create a new forum thread
export async function createForumThread(data: {
  title: string;
  content: string;
  author: string;
  municipalityId: string;
  tags: string[];
}) {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/forum/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create thread');
    return await response.json();
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
}

// Vote on a thread or comment
export async function vote(data: {
  threadId?: string;
  commentId?: string;
  voteType: 'up' | 'down';
}) {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/forum/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to vote');
    return await response.json();
  } catch (error) {
    console.error('Error voting:', error);
    throw error;
  }
}

// Add a comment
export async function addComment(data: {
  content: string;
  author: string;
  threadId: string;
}) {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/forum/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return await response.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}