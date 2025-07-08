'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, Heart, Code, Users } from 'lucide-react';
import founderPic from './founderpiclmfao.jpg';

export default function Team() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const founder = {
    name: 'Aryan Ahuja',
    title: 'Founder',
    bio: 'Hi! I\'m a high school student trying to make a difference. Between swim practice and Model Congress competitions, I spend my time coding and thinking about how technology can help people engage with their local government.',
    mission: 'I started MyTownhall because I believe everyone should be able to understand how their tax dollars are spent—without needing a political science degree.',
    interests: [
      { icon: Code, label: 'Coding', description: 'Learning new technologies' },
      { icon: Users, label: 'Politics', description: 'Model Congress competitor' },
      { icon: Heart, label: 'Community', description: 'Making government accessible' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
            Behind <span className="font-medium text-emerald-600">MyTownhall</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A student project aimed at making local government more accessible to everyone
          </p>
        </div>

        {/* Founder Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp">
            {/* Two Column Layout */}
            <div className="grid md:grid-cols-5 gap-0">
              {/* Image Column */}
              <div className="md:col-span-2 relative h-80 md:h-auto bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={founderPic}
                    alt={founder.name}
                    fill
                    className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
                      <div className="text-emerald-600">
                        <div className="w-20 h-20 border-4 border-emerald-300 border-t-emerald-600 rounded-full animate-spin"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Content Column */}
              <div className="md:col-span-3 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                    {founder.name}
                  </h2>
                  <p className="text-emerald-600 text-sm font-medium">
                    {founder.title}
                  </p>
                </div>
                
                <p className="text-slate-600 leading-relaxed mb-6">
                  {founder.bio}
                </p>
                
                <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                  <p className="text-slate-700 text-sm italic">
                    "{founder.mission}"
                  </p>
                </div>
                
                {/* Interests */}
                <div className="space-y-3">
                  {founder.interests.map((interest, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <interest.icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{interest.label}</p>
                        <p className="text-xs text-slate-500">{interest.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Note */}
          <div className="mt-12 bg-slate-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">A Personal Note</h3>
            <p className="text-slate-600 leading-relaxed mb-6 max-w-2xl mx-auto">
              MyTownhall is still in its early stages, and I'm learning as I go. 
              If you have feedback, suggestions, or just want to chat about making 
              government more transparent, I'd love to hear from you!
            </p>
            <a
              href="mailto:aryan@mytownhall.org"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors group"
            >
              <Mail className="w-4 h-4" />
              <span>Send me an email</span>
              <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Future Vision */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Looking Ahead</h3>
              <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
                This project started as a way to combine my interests in technology and civic engagement. 
                With your help and feedback, I hope MyTownhall can grow into a tool that truly makes 
                local government more accessible for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}