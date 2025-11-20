import React, { useState } from 'react';
import { Article, Category } from '../types';
import { AUTHORS } from '../constants';
import { createArticle } from '../services/apiService';
import { generateArticleTags, generateDraftContent } from '../services/geminiService';
import { Sparkles, Save, Type, Tag as TagIcon } from 'lucide-react';

interface AdminPageProps {
  onPublish: (article: Article) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onPublish }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('News');
  const [tags, setTags] = useState<string[]>([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const handleGenerateTags = async () => {
    if (!title) return alert("Please enter a title first.");
    setIsGeneratingTags(true);
    const generatedTags = await generateArticleTags(title, content || summary);
    setTags(generatedTags);
    setIsGeneratingTags(false);
  };

  const handleAiDraft = async () => {
    if (!title) return alert("Please enter a title for the AI to work with.");
    setIsDrafting(true);
    const draft = await generateDraftContent(title);
    setContent(draft);
    setIsDrafting(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setPublishError(null);

    try {
      const newArticle = await createArticle({
        title,
        summary,
        content,
        category,
        author: AUTHORS['david'], // Mock logged-in user
        publishedAt: new Date().toISOString(),
        imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
        tags,
        readTimeMinutes: Math.ceil(content.length / 1000) || 5,
        isTopStory: false
      });
      
      onPublish(newArticle);
      
      // Reset form
      setTitle('');
      setSummary('');
      setContent('');
      setCategory('News');
      setTags([]);
    } catch (err: any) {
      setPublishError(err.message || 'Failed to publish article');
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-navy-800 text-white px-8 py-6 border-b border-navy-900 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold">Editorial Dashboard</h1>
            <p className="text-gray-300 text-sm mt-1">Create new content</p>
          </div>
          <div className="bg-navy-700 px-3 py-1 rounded text-xs uppercase tracking-wider text-electric-600 font-bold">
            Admin
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {publishError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {publishError}
            </div>
          )}
          
          {/* Title Section */}
          <div className="space-y-4">
             <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Headline</label>
             <div className="flex gap-2">
                <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="flex-grow text-xl font-serif p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-electric-600 focus:border-transparent"
                    placeholder="Enter a catchy headline..."
                    required
                />
                <button 
                    type="button"
                    onClick={handleAiDraft}
                    disabled={isDrafting}
                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-200 transition-colors flex items-center gap-2 whitespace-nowrap text-sm font-medium"
                >
                    <Sparkles size={16} />
                    {isDrafting ? 'Drafting...' : 'AI Draft'}
                </button>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Category</label>
                <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value as Category)}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-electric-600"
                >
                    <option value="News">News</option>
                    <option value="Deep Dive">Deep Dive</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Opinion">Opinion</option>
                    <option value="Research">Research</option>
                </select>
            </div>
            <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide flex justify-between">
                    <span>Tags</span>
                    <button 
                        type="button" 
                        onClick={handleGenerateTags} 
                        disabled={isGeneratingTags}
                        className="text-electric-600 text-xs flex items-center gap-1 hover:underline disabled:opacity-50"
                    >
                        <Sparkles size={12} /> {isGeneratingTags ? 'Generating...' : 'Auto-generate'}
                    </button>
                </label>
                <input 
                    type="text" 
                    value={tags.join(', ')}
                    onChange={e => setTags(e.target.value.split(',').map(t => t.trim()))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-electric-600"
                    placeholder="AI, Tech, Future (comma separated)"
                />
            </div>
          </div>

          <div className="space-y-4">
             <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Executive Summary</label>
             <textarea 
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-electric-600"
                placeholder="A short 2-3 sentence hook for the card view..."
                required
             />
          </div>

          <div className="space-y-4">
             <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Body Content (HTML supported)</label>
             <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-96 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-electric-600"
                placeholder="<p>Write your article here...</p>"
                required
             />
             <p className="text-xs text-gray-500">Tip: Use &lt;h3&gt; for subheadings and &lt;blockquote&gt; for pull quotes.</p>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button type="button" className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md transition-colors">
                Save Draft
            </button>
            <button 
              type="submit" 
              disabled={isPublishing}
              className="px-8 py-2 bg-electric-600 text-white font-bold rounded-md hover:bg-electric-700 shadow-md transform active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save size={18} /> {isPublishing ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};