import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ArticleGrid } from './components/ArticleGrid';
import { ArticlePage } from './components/ArticlePage';
import { AdminPage } from './components/AdminPage';
import { EnhancedAdminPage } from './components/EnhancedAdminPage';
import { LoginPage } from './components/LoginPage';
import { Newsletter } from './components/Newsletter';
import { Article, Category } from './types';
import { fetchArticles, fetchArticleById } from './services/apiService';
import { login, logout, verifySession } from './services/authService';
import { Search, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { authenticated } = await verifySession();
      setIsAuthenticated(authenticated);
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  // Load articles from API
  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchArticles({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined,
      });
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Routing Logic
  let ComponentToRender: React.ReactNode;
  
  const isArticleRoute = currentHash.startsWith('#/article/');
  const articleId = isArticleRoute ? currentHash.split('/article/')[1] : null;

  const handleAddArticle = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
    window.location.hash = '#/';
  };

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      await login({ username, password });
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    window.location.hash = '#/';
  };

  // Show loading state
  if (loading && articles.length === 0) {
    ComponentToRender = (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  } else if (error) {
    ComponentToRender = (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadArticles}
            className="px-4 py-2 bg-navy-800 text-white rounded-md hover:bg-navy-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  } else {
    const filteredArticles = articles;

    if (currentHash === '#/admin') {
      // Check if user is authenticated
      if (!isAuthenticated) {
        ComponentToRender = <LoginPage onLogin={handleLogin} />;
      } else {
        ComponentToRender = <EnhancedAdminPage onPublish={handleAddArticle} onLogout={handleLogout} />;
      }
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