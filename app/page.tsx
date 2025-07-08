'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, Users, Calendar, ChevronDown } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const texts = ['Transparent', 'Accessible', 'Interactive'];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50 opacity-90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-100 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-50 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Logo animation */}
          <div className={`transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-7xl md:text-9xl font-extralight text-slate-900 mb-8 tracking-tight">
              My<span className="font-light text-emerald-600">Townhall (beta-testing)</span>
            </h1>
          </div>
          
          {/* Animated tagline */}
          <div className={`transition-all duration-1000 delay-200 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-2xl md:text-3xl text-slate-700 mb-4 font-light">
              Local government made
            </p>
            <div className="h-12 md:h-16 mb-12">
              <p className="text-3xl md:text-5xl font-medium text-emerald-600 transition-all duration-500 transform">
                {texts[currentText]}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-400 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Link
              href="/explore"
              className="group relative inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">Start Exploring</span>
              <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-slate-200"
            >
              <span>Learn More</span>
            </Link>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToFeatures}
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <ChevronDown className="w-8 h-8 text-slate-400 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              Everything you need for <span className="text-emerald-600 font-medium">civic engagement</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Three powerful tools designed to connect citizens with their local government
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature cards with hover effects */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Transparency</h3>
                <p className="text-slate-600 leading-relaxed">
                  Access real-time budget data, meeting minutes, and government decisions with unprecedented clarity.
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Community</h3>
                <p className="text-slate-600 leading-relaxed">
                  Connect with neighbors, join discussions, and build a stronger, more engaged community together.
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Action</h3>
                <p className="text-slate-600 leading-relaxed">
                  Stay informed about upcoming meetings, important votes, and opportunities to make your voice heard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold text-white mb-2">12</div>
              <div className="text-emerald-100">Active Municipalities</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold text-white mb-2">2.5k</div>
              <div className="text-emerald-100">Engaged Citizens</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold text-white mb-2">85%</div>
              <div className="text-emerald-100">Engagement Increase</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-emerald-100">Access to Information</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
            Ready to transform your <span className="text-emerald-400 font-medium">local democracy?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Join thousands of citizens who are making their communities more transparent, accessible, and engaged.
          </p>
          <Link
            href="/explore"
            className="group inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}