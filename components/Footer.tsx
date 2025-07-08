'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  
  // Don't show footer on dynamic town pages
  if (pathname.startsWith('/towns/')) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-light text-white mb-4">
              My<span className="font-normal text-emerald-400">Townhall</span>
            </h3>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Making local government transparent, accessible, and interactive. 
              Empowering communities with the tools they need for civic engagement. (Currently in beta—all data is fictional and for demonstration purposes only.)
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                  About Us
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                  Explore
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                  Our Team
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                  Get in Touch
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <a href="mailto:hello@MyTownhall.org" className="hover:text-white transition-colors duration-200">
                  hello@MyTownhall.org
                </a>
              </li>
              <li>
                <a href="tel:5551234567" className="hover:text-white transition-colors duration-200">
                  (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/terms" 
                className="hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                href="/privacy" 
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
            <div className="text-sm text-slate-500">
              © 2024 MyTownhall. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}