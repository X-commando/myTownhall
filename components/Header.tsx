'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    { name: 'About', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
  ];

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`fixed top-0 right-0 z-50 transition-all duration-300 ${
        isHomePage && !isScrolled && !isOpen
          ? 'bg-transparent' 
          : 'bg-white/95 backdrop-blur-md shadow-sm'
      }`}>
        <div className="p-4 md:p-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`hamburger ${isOpen ? 'hamburger-open' : ''} p-3 rounded-xl transition-all duration-200 hover:bg-slate-100/50 group`}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <span className={`hamburger-line h-0.5 block transition-all duration-300 ${
                isHomePage && !isScrolled && !isOpen ? 'bg-slate-700' : 'bg-slate-700'
              } group-hover:bg-emerald-600`}></span>
              <span className={`hamburger-line h-0.5 block transition-all duration-300 ${
                isHomePage && !isScrolled && !isOpen ? 'bg-slate-700' : 'bg-slate-700'
              } group-hover:bg-emerald-600`}></span>
              <span className={`hamburger-line h-0.5 block transition-all duration-300 ${
                isHomePage && !isScrolled && !isOpen ? 'bg-slate-700' : 'bg-slate-700'
              } group-hover:bg-emerald-600`}></span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[9999] transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500"
          onClick={() => setIsOpen(false)} 
        />
        
        <div className={`absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-slate-900">
                  My<span className="font-normal text-emerald-600">Townhall</span>
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            
            <nav className="flex-1 px-6 py-8">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 text-lg rounded-xl transition-all duration-200 ${
                      pathname === item.href 
                        ? 'bg-emerald-50 text-emerald-700 font-medium' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            
            <div className="p-6 border-t border-slate-100">
              <p className="text-sm text-slate-500 text-center">
                Making government transparent,<br />
                accessible, and interactive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}