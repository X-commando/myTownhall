'use client';

import { useEffect, useState } from 'react';
import { Calendar, DollarSign, MessageSquare, Users, TrendingUp, Clock, ArrowRight, Eye, Activity, TrendingDown } from 'lucide-react';
import { getTown } from '@/lib/api';
import BudgetChart from '@/components/BudgetChart';
import ForumSection from '@/components/ForumSection';
import MeetingsSection from '@/components/MeetingsSection';
import TownLoading from '@/components/TownLoading';
import Link from 'next/link';

interface TownClientPageProps {
  slug: string;
}

export default function TownClientPage({ slug }: TownClientPageProps) {
  const [municipality, setMunicipality] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [budgetData, setBudgetData] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [forumThreads, setForumThreads] = useState<any[]>([]);

  useEffect(() => {
    const loadTownData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const townData = await getTown(slug);
        
        if (townData) {
          // Format the municipality data
          const formattedTown = {
            id: townData.id,
            name: townData.name,
            state: townData.state,
            zipCode: townData.zipCode,
            population: townData.population,
            isServiced: townData.isServiced,
            coordinates: [townData.latitude, townData.longitude],
            slug: townData.slug
          };
          
          setMunicipality(formattedTown);
          
          // Set budget data - fix the field names to match API response
          if (townData.Budget && townData.Budget.length > 0) {
            setBudgetData({
              year: townData.Budget[0].year,
              totalBudget: townData.Budget[0].totalBudget,
              categories: townData.Budget[0].BudgetCategory, // Fix: use BudgetCategory instead of categories
              municipalityId: townData.id
            });
          }
          
          // Set meetings - fix the field name
          setMeetings(townData.Meeting || []); // Fix: use Meeting instead of meetings
          
          // Set forum threads - fix the field name
          setForumThreads(townData.ForumThread || []); // Fix: use ForumThread instead of forumThreads
        } else {
          setError('Municipality not found');
        }
      } catch (err) {
        console.error('Error loading town data:', err);
        setError('Failed to load municipality data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTownData();
  }, [slug]);

  // Calculate budget trends and stats
  const getBudgetStats = () => {
    if (!budgetData) return null;
    
    const totalBudget = budgetData.totalBudget;
    const budgetInMillions = (totalBudget / 1000000).toFixed(1);
    const perCapita = (totalBudget / municipality.population).toFixed(0);
    
    return {
      total: budgetInMillions,
      perCapita: perCapita,
      year: budgetData.year
    };
  };

  // Get recent activity (mixed content)
  const getRecentActivity = () => {
    const activities: any[] = [];
    
    // Add recent forum threads
    forumThreads.slice(0,2).forEach(thread => {
      activities.push({
        type: 'forum',
        title: thread.title,
        content: thread.content.substring(0, 80) + '...',
        author: thread.author,
        upvotes: thread.upvotes,
        date: new Date(thread.createdAt),
        data: thread
      });
    });
    
    // Add upcoming meetings
    const upcomingMeetings = meetings.filter(m => m.status === 'upcoming').slice(0, 2);
    upcomingMeetings.forEach(meeting => {
      activities.push({
        type: 'meeting',
        title: meeting.title,
        content: `${meeting.committee} • ${new Date(meeting.date).toLocaleDateString()}`,
        author: 'City Council',
        date: new Date(meeting.date),
        data: meeting
      });
    });
    
    // Sort by date (most recent first)
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl px-4 pt-8">
          {/* Breadcrumbs and Back Button Skeleton */}
          <div className="flex items-center gap-2 mb-6 animate-pulse">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded-full" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <TownLoading />
      </div>
    );
  }

  // Show error state
  if (error || !municipality) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl px-4 pt-8">
          {/* Breadcrumbs and Back Button */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/explore" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Explore
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Not Found</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-custom mb-4">
            {error || 'Municipality Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error 
              ? 'There was an error loading the municipality data. Please try again later.'
              : 'The requested municipality could not be found.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'budget', name: 'Budget', icon: DollarSign },
    { id: 'meetings', name: 'Meetings', icon: Calendar },
    { id: 'forum', name: 'Community Forum', icon: MessageSquare }
  ];

  const budgetStats = getBudgetStats();
  const recentActivity = getRecentActivity();
  const upcomingMeetingsCount = meetings.filter(m => m.status === 'upcoming').length;
  const totalThreads = forumThreads.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs and Back Button */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/explore" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Explore
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">{municipality.name}</span>
        </div>
      </div>
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {municipality.name}, {municipality.state}
              </h1>
              <div className="flex items-center space-x-6 text-sm opacity-90">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Population: {municipality.population.toLocaleString()}</span>
                </span>
                <span>ZIP: {municipality.zipCode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-primary-custom">
                      ${budgetStats ? `${budgetStats.total}M` : 'N/A'}
                    </p>
                    {budgetStats && (
                      <p className="text-xs text-gray-500 mt-1">
                        ${budgetStats.perCapita} per capita • {budgetStats.year}
                      </p>
                    )}
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Community Activity</p>
                    <p className="text-2xl font-bold text-primary-custom">{totalThreads}</p>
                    <p className="text-xs text-gray-500 mt-1">Active discussions</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                    <p className="text-2xl font-bold text-primary-custom">{upcomingMeetingsCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Population</p>
                    <p className="text-2xl font-bold text-primary-custom">
                      {municipality.population.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-50 mt-1">
                      {upcomingMeetingsCount} upcoming meetings
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Budget Summary Card */}
            {budgetStats && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-primary-custom">Budget Summary</h2>
                  <button 
                    onClick={() => setActiveTab('budget')}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View Full Budget
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-custom">${budgetStats.total}M</p>
                    <p className="text-sm text-gray-600">Total Budget</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-custom">${budgetStats.perCapita}</p>
                    <p className="text-sm text-gray-600">Per Capita</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-custom">{budgetStats.year}</p>
                    <p className="text-sm text-gray-600">Fiscal Year</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Feed */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-custom">Recent Activity</h2>
                <button 
                  onClick={() => setActiveTab('forum')}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  View All Activity
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'forum' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {activity.type === 'forum' ? (
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Calendar className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-custom">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{activity.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{activity.author}</span>
                          {activity.type === 'forum' && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {activity.upvotes} upvotes
                            </span>
                          )}
                          <span>{activity.date.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to start a discussion!</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-primary-custom mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('budget')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <DollarSign className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-primary-custom">View Budget Details</p>
                    <p className="text-sm text-gray-600">Explore spending breakdown</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('meetings')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Calendar className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-primary-custom">Browse Meetings</p>
                    <p className="text-sm text-gray-600">View upcoming and past meetings</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('forum')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-primary-custom">Join Discussion</p>
                    <p className="text-sm text-gray-600">Participate in community forum</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budget' && budgetData && (
          <div className="space-y-8">
            <BudgetChart data={budgetData} />
          </div>
        )}

        {activeTab === 'meetings' && (
          <MeetingsSection meetings={meetings} />
        )}

        {activeTab === 'forum' && (
          <ForumSection threads={forumThreads} municipalityId={municipality.id} />
        )}
      </div>
    </div>
  );
}