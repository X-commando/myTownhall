'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'Founder & CEO',
    image: 'https://images.pexels.com/photos/3771135/pexels-photo-3771135.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    bio: 'Former city council member with 10+ years in public service. Passionate about making government accessible to everyone.'
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    title: 'Lead Developer',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    bio: 'Full-stack developer specializing in civic tech. Previously worked at Code for America on municipal data platforms.'
  },
  {
    id: 3,
    name: 'Elena Kowalski',
    title: 'Data Analyst',
    image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    bio: 'Data scientist with expertise in government transparency. Masters in Public Policy from Georgetown University.'
  },
  {
    id: 4,
    name: 'James Thompson',
    title: 'Community Outreach',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    bio: 'Community organizer and former journalist. Dedicated to connecting citizens with their local representatives.'
  },
  {
    id: 5,
    name: 'Priya Patel',
    title: 'UX Designer',
    image: 'https://images.pexels.com/photos/3756170/pexels-photo-3756170.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    bio: 'User experience designer focused on accessible design. Previously designed digital services for the City of Boston.'
  },
  {
    id: 6,
    name: 'David Kim',
    title: 'Legal Advisor',
    image: 'https://images.pexels.com/photos/2182972/pexels-photo-2182972.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    bio: 'Constitutional lawyer specializing in transparency laws. Ensures MyTownhall complies with all municipal regulations.'
  }
];

export default function Team() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpandedMember(expandedMember === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background-light pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-custom mb-6">
            Our Team
          </h1>
          <p className="text-xl text-primary-custom/80 max-w-3xl mx-auto">
            Meet the passionate individuals working to make local government more transparent and accessible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary-custom">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm font-medium uppercase tracking-wider">
                      {member.title}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => toggleExpanded(member.id)}
                    className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
                    aria-label={expandedMember === member.id ? 'Collapse bio' : 'Expand bio'}
                  >
                    {expandedMember === member.id ? (
                      <Minus className="w-4 h-4 text-primary" />
                    ) : (
                      <Plus className="w-4 h-4 text-primary" />
                    )}
                  </button>
                </div>
                
                <div className={`transition-all duration-300 overflow-hidden ${
                  expandedMember === member.id 
                    ? 'max-h-32 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <p className="text-primary-custom/70 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Join Our Mission
            </h2>
            <p className="text-primary-custom/80 mb-6">
              We're always looking for passionate individuals who want to make a difference in civic engagement.
            </p>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}