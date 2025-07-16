'use client';

import { useEffect, useState } from 'react';
import { Calendar, DollarSign, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';
import { getTown } from '@/lib/api';
import BudgetChart from '@/components/BudgetChart';
import ForumSection from '@/components/ForumSection';
import MeetingsSection from '@/components/MeetingsSection';
import TownLoading from '@/components/TownLoading';

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

  // Show loading state
  if (isLoading) {
    return <TownLoading />;
  }

  // Show error state
  if (error || !municipality) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-custom mb-4">
            {error || 'Municipality Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error 
              ? 'There was an error loading the municipality data. Please try again later.'
              : 'The requested municipality could not be found.'}
          </p>
          <a 
            href="/explore" 
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Explore
          </a>
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

  return (
    <div className="min-h-screen bg-background">
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
                      ${budgetData ? (budgetData.totalBudget / 1000000).toFixed(1) + 'M' : 'N/A'}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Threads</p>
                    <p className="text-2xl font-bold text-primary-custom">{forumThreads.length}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                    <p className="text-2xl font-bold text-primary-custom">
                      {meetings.filter(m => m.status === 'upcoming').length}
                    </p>
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
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Mini Budget Chart */}
            {budgetData && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary-custom mb-4">Budget Overview</h2>
                <BudgetChart data={budgetData} />
              </div>
            )}

            {/* Recent Forum Activity */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-primary-custom mb-4">Recent Community Activity</h2>
              <div className="space-y-4">
                {forumThreads.slice(0, 3).map((thread) => (
                  <div key={thread.id} className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold text-primary-custom">{thread.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{thread.content.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>by {thread.author}</span>
                      <span>{thread.upvotes} upvotes</span>
                    </div>
                  </div>
                ))}
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