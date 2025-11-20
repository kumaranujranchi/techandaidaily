import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-white text-lg font-bold mb-4">Tech & AI Daily</h3>
            <p className="text-sm mb-6 max-w-sm">
              Bridging the gap between complex research and practical engineering. 
              Our mission is to provide clarity in the rapidly evolving world of artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Sections</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-electric-600">Latest News</a></li>
              <li><a href="#" className="hover:text-electric-600">Deep Dives</a></li>
              <li><a href="#" className="hover:text-electric-600">Tutorials</a></li>
              <li><a href="#" className="hover:text-electric-600">Opinion</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-electric-600">About Us</a></li>
              <li><a href="#" className="hover:text-electric-600">Careers</a></li>
              <li><a href="#" className="hover:text-electric-600">Editorial Policy</a></li>
              <li><a href="#" className="hover:text-electric-600">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} Tech & AI Daily. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};