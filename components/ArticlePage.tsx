import React, { useState } from 'react';
import { Article } from '../types';
import { Clock, Calendar, Share2, Bookmark, Sparkles } from 'lucide-react';
import { generateArticleSummary } from '../services/geminiService';

interface ArticlePageProps {
  article: Article;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  const [aiSummary, setAiSummary] = useState<string | undefined>(article.aiSummary);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoadingAi(true);
    const summary = await generateArticleSummary(article.content);
    setAiSummary(summary);
    setIsLoadingAi(false);
  };

  return (
    <div className="bg-offwhite min-h-screen pb-20 animate-fadeIn">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 pt-12 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-electric-600/10 text-electric-600 text-xs font-bold uppercase tracking-wider rounded-full">
              {article.category}
            </span>
            {article.tags.map(tag => (
              <span key={tag} className="text-xs text-gray-500 font-medium">#{tag}</span>
            ))}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-navy-800 leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light">
            {article.summary}
          </p>

          <div className="flex items-center justify-between py-6 border-t border-gray-100">
            <div className="flex items-center">
              <img src={article.author.avatarUrl} alt={article.author.name} className="w-12 h-12 rounded-full border border-gray-200 mr-4" />
              <div>
                <p className="text-sm font-bold text-navy-800">{article.author.name}</p>
                <p className="text-xs text-gray-500">{article.author.role}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm gap-6">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{article.readTimeMinutes} min read</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Body */}
      <div className="container mx-auto px-4 max-w-4xl py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar Actions */}
        <div className="hidden lg:block col-span-1 space-y-6 sticky top-24 h-fit">
           <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-electric-600 hover:border-electric-600 transition-all shadow-sm hover:scale-110 active:scale-95">
             <Share2 size={18} />
           </button>
           <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-navy-800 hover:border-navy-800 transition-all shadow-sm hover:scale-110 active:scale-95">
             <Bookmark size={18} />
           </button>
        </div>

        {/* Main Text */}
        <main className="col-span-1 lg:col-span-11">
          
          {/* AI Summary Box */}
          <div className="bg-navy-50 border border-navy-100 rounded-xl p-6 mb-10 transition-all duration-500">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className={`text-electric-600 ${isLoadingAi ? 'animate-spin' : ''}`} size={20} />
              <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wider">AI Key Takeaways</h3>
            </div>
            
            {aiSummary ? (
               <p className="text-navy-800 text-sm leading-relaxed font-medium border-l-2 border-electric-600 pl-4 animate-fadeIn">
                 {aiSummary}
               </p>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">Want a quick briefing? Generate a smart summary instantly.</p>
                <button 
                  onClick={handleGenerateSummary}
                  disabled={isLoadingAi}
                  className="bg-white border border-gray-300 text-navy-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {isLoadingAi ? 'Thinking...' : 'Generate Summary'}
                </button>
              </div>
            )}
          </div>

          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-electric-600 hover:prose-a:text-electric-700 prose-img:rounded-xl">
            {/* Rendering HTML content safely - in a real app use DOMPurify */}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Bottom Actions */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h4 className="font-bold text-navy-800 mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};