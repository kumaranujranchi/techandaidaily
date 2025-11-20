import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ArticleGrid } from './components/ArticleGrid';
import { ArticlePage } from './components/ArticlePage';
import { AdminPage } from './components/AdminPage';
import { Newsletter } from './components/Newsletter';
import { Article, Category } from './types';
import { MOCK_ARTICLES } from './constants';
import { Search, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Routing Logic
  let ComponentToRender: React.ReactNode;
  
  const isArticleRoute = currentHash.startsWith('#/article/');
  const articleId = isArticleRoute ? currentHash.split('/article/')[1] : null;
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddArticle = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
    window.location.hash = '#/';
  };

  if (currentHash === '#/admin') {
    ComponentToRender = <AdminPage onPublish={handleAddArticle} />;
  } else if (isArticleRoute && articleId) {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      ComponentToRender = <ArticlePage article={article} />;
    } else {
      ComponentToRender = <div className="min-h-screen flex items-center justify-center text-xl font-serif">Article not found.</div>;
    }
  } else {
    // Home / Category View
    const topStory = filteredArticles.find(a => a.isTopStory) || filteredArticles[0];
    const feed = filteredArticles.filter(a => a.id !== topStory?.id);

    ComponentToRender = (
      <>
        {/* Filters & Search Bar (Only on Home) */}
        <div className="container mx-auto px-4 py-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {(['All', 'News', 'Deep Dive', 'Tutorial', 'Opinion', 'Research'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as Category | 'All')}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-navy-800 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>

             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent"
                />
             </div>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
           <div className="py-20 text-center text-gray-500">
             <p className="text-lg font-serif italic">No stories found matching your criteria.</p>
             <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="mt-4 text-electric-600 underline">Clear filters</button>
           </div>
        ) : (
          <>
            {/* Don't show Hero if searching, to keep results dense */}
            {!searchQuery && selectedCategory === 'All' && <Hero article={topStory} />}
            
            <div className="container mx-auto px-4 py-12">
              <div className="flex items-center mb-8">
                <div className="h-px flex-grow bg-gray-200"></div>
                <h2 className="px-4 text-sm font-bold tracking-wider text-gray-500 uppercase">
                  {searchQuery ? 'Search Results' : 'Latest Feed'}
                </h2>
                <div className="h-px flex-grow bg-gray-200"></div>
              </div>
              <ArticleGrid articles={searchQuery || selectedCategory !== 'All' ? filteredArticles : feed} />
            </div>
          </>
        )}
        <Newsletter />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite text-navy-800 font-sans selection:bg-electric-600 selection:text-white">
      <Navbar />
      <main className="flex-grow pt-16">
        {ComponentToRender}
      </main>
      <Footer />
    </div>
  );
};

export default App;