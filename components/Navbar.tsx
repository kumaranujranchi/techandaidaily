import React, { useState } from 'react';
import { Menu, X, Bell, User, PenTool } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-navy-800 text-white z-50 border-b border-navy-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#/" className="font-serif text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-electric-600 rounded-sm flex items-center justify-center text-white font-sans font-bold text-lg">T</div>
              Tech & AI Daily
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</a>
            <a href="#/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">News</a>
            <a href="#/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Research</a>
            <a href="#/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Podcasts</a>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#/admin" className="p-2 text-gray-400 hover:text-white transition-colors" title="Author Dashboard">
                <PenTool size={18} />
            </a>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-electric-600 transition-colors">
              <User size={16} />
            </div>
            <button className="bg-electric-600 hover:bg-electric-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
              Subscribe
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-900 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-navy-800">Home</a>
            <a href="#/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-800">News</a>
            <a href="#/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-800">Research</a>
            <a href="#/admin" className="block px-3 py-2 rounded-md text-base font-medium text-electric-600 hover:text-electric-500">Author Dashboard</a>
          </div>
        </div>
      )}
    </nav>
  );
};