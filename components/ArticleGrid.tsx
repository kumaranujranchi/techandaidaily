import React from 'react';
import { Article } from '../types';
import { Clock, Tag } from 'lucide-react';

interface ArticleGridProps {
  articles: Article[];
}

const ArticleCard: React.FC<{ article: Article; index: number }> = ({ article, index }) => (
  <article 
    className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full group opacity-0 animate-fadeInUp"
    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
  >
    <a href={`#/article/${article.id}`} className="relative h-48 overflow-hidden">
      <img 
        src={article.imageUrl} 
        alt={article.title} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3 bg-navy-900/90 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
        {article.category}
      </div>
    </a>
    <div className="p-6 flex-grow flex flex-col">
      <div className="flex items-center text-xs text-gray-500 mb-3 gap-2">
        <span className="font-medium text-electric-600">{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {article.readTimeMinutes}m read</span>
      </div>
      
      <h3 className="font-serif text-xl font-bold text-navy-800 mb-3 leading-snug group-hover:text-electric-600 transition-colors">
        <a href={`#/article/${article.id}`}>
          {article.title}
        </a>
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
        {article.summary}
      </p>
      
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <img src={article.author.avatarUrl} alt={article.author.name} className="w-6 h-6 rounded-full mr-2" />
          <span className="text-xs font-medium text-gray-700">{article.author.name}</span>
        </div>
        <div className="flex gap-2">
            {article.tags.slice(0,1).map(tag => (
                <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
            ))}
        </div>
      </div>
    </div>
  </article>
);

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
};