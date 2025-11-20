import React from 'react';
import { Article } from '../types';
import { Clock, ArrowRight } from 'lucide-react';

interface HeroProps {
  article: Article;
}

export const Hero: React.FC<HeroProps> = ({ article }) => {
  return (
    <section className="bg-navy-800 text-white relative overflow-hidden">
      {/* Background Pattern subtle */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6 opacity-0 animate-fadeInUp" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-electric-600 text-xs font-bold uppercase tracking-wider rounded-sm">
                Top Story
              </span>
              <span className="text-electric-600 font-medium text-sm flex items-center gap-1">
                 <Clock size={14} /> {article.readTimeMinutes} min read
              </span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-white">
              <a href={`#/article/${article.id}`} className="hover:text-gray-200 transition-colors">
                {article.title}
              </a>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              {article.summary}
            </p>
            
            <div className="flex items-center pt-4">
              <img 
                src={article.author.avatarUrl} 
                alt={article.author.name} 
                className="w-10 h-10 rounded-full border-2 border-navy-700 mr-3"
              />
              <div>
                <p className="text-sm font-medium text-white">{article.author.name}</p>
                <p className="text-xs text-gray-400">{article.author.role}</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-5 opacity-0 animate-fadeIn" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <a href={`#/article/${article.id}`} className="block group relative overflow-hidden rounded-lg shadow-2xl">
               <div className="absolute inset-0 bg-electric-600/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
               <img 
                 src={article.imageUrl} 
                 alt={article.title} 
                 className="w-full h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
               />
               <div className="absolute bottom-4 right-4 z-20 bg-white text-navy-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                 <ArrowRight size={20} />
               </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};