'use client';

import { Loader2, Building2, DollarSign, Calendar, MessageSquare } from 'lucide-react';

export default function TownLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="bg-emerald-600 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-3">
            <div className="h-10 bg-emerald-500 rounded-lg w-64"></div>
            <div className="flex items-center space-x-6">
              <div className="h-4 bg-emerald-500 rounded w-32"></div>
              <div className="h-4 bg-emerald-500 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading Message */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <Building2 className="w-16 h-16 text-emerald-500 mb-4" />
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin absolute -bottom-1 -right-1" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Municipality Data</h2>
          <p className="text-gray-500 text-sm">Please wait while we fetch the latest information...</p>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {[
            { icon: DollarSign, label: 'Total Budget' },
            { icon: MessageSquare, label: 'Active Threads' },
            { icon: Calendar, label: 'Upcoming Meetings' },
            { icon: Building2, label: 'Population' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-7 bg-gray-300 rounded w-24"></div>
                </div>
                <stat.icon className="w-8 h-8 text-gray-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>

        {/* Activity Skeleton */}
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-56 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-gray-200 pl-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-3 bg-gray-100 rounded w-20"></div>
                  <div className="h-3 bg-gray-100 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}