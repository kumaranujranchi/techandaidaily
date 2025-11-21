import React, { useState, useEffect } from 'react';
import { Article, Category } from '../types';
import { createArticle } from '../services/apiService';
import { Save, Upload, X, Eye, Image, Globe, Tag as TagIcon, FileText } from 'lucide-react';

interface EnhancedAdminPageProps {
  onPublish: (article: Article) => void;
  onLogout: () => void;
}

export const EnhancedAdminPage: React.FC<EnhancedAdminPageProps> = ({ onPublish, onLogout }) => {
  // Basic fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('News');
  const [tags, setTags] = useState<string>('');
  const [isTopStory, setIsTopStory] = useState(false);
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [slug, setSlug] = useState('');
  
  // Images
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // UI states
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(autoSlug);
    }
  }, [title]);

  // Auto-fill meta title if empty
  useEffect(() => {
    if (title && !metaTitle) {
      setMetaTitle(title.slice(0, 70));
    }
  }, [title]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'featured' | 'og') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload.php', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const fullUrl = window.location.origin + data.url;

      if (type === 'thumbnail') setThumbnailUrl(fullUrl);
      else if (type === 'featured') setImageUrl(fullUrl);
      else if (type === 'og') setOgImage(fullUrl);

    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      const newArticle = await createArticle({
        title,
        summary,
        content,
        category,
        author: { id: 'admin', name: 'Admin', avatarUrl: '', role: 'Editor' },
        publishedAt: new Date().toISOString(),
        imageUrl: imageUrl || thumbnailUrl || `https://picsum.photos/seed/${Date.now()}/800/600`,
        tags: tagsArray,
        readTimeMinutes: Math.ceil(content.length / 1000) || 5,
        isTopStory,
        // SEO fields
        metaTitle,
        metaDescription,
        metaKeywords,
        slug,
        thumbnailUrl,
        ogImage: ogImage || thumbnailUrl
      });

      onPublish(newArticle);
      setPublishSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle('');
        setSummary('');
        setContent('');
        setCategory('News');
        setTags('');
        setIsTopStory(false);
        setMetaTitle('');
        setMetaDescription('');
        setMetaKeywords('');
        setSlug('');
        setThumbnailUrl('');
        setImageUrl('');
        setOgImage('');
        setPublishSuccess(false);
      }, 2000);

    } catch (err: any) {
      setPublishError(err.message || 'Failed to publish article');
    } finally {
      setIsPublishing(false);
    }
  };

  const TabButton: React.FC<{ id: typeof activeTab; icon: React.ReactNode; label: string }> = ({ id, icon, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-electric-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 text-sm">Create & Manage Articles</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex space-x-2">
              <TabButton id="content" icon={<FileText className="w-4 h-4" />} label="Content" />
              <TabButton id="media" icon={<Image className="w-4 h-4" />} label="Media" />
              <TabButton id="seo" icon={<Globe className="w-4 h-4" />} label="SEO" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {publishError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {publishError}
              </div>
            )}

            {publishSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                Article published successfully!
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-600 focus:border-transparent"
                    placeholder="Enter article title..."
                    required
                  />
                </div>

                {/* Category & Top Story */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-600 focus:border-transparent"
                    >
                      <option value="News">News</option>
                      <option value="Deep Dive">Deep Dive</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Opinion">Opinion</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isTopStory}
                        onChange={(e) => setIsTopStory(e.target.checked)}
                        className="w-5 h-5 text-electric-600 rounded focus:ring-2 focus:ring-electric-600"
                      />
                      <span className="text-sm font-medium text-gray-700">Mark as Top Story</span>
                    </label>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary / Excerpt *</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-600 focus:border-transparent"
                    placeholder="Brief summary of the article..."
                    required
                  />
                </div>

                {/* Rich Text Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content (HTML) *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-600 focus:border-transparent font-mono text-sm"
                    placeholder="<p>Write your article content here... HTML supported</p>"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Supports HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;blockquote&gt;
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-600 focus:border-transparent"
                    placeholder="AI, Machine Learning, Technology (comma separated)"
                  />
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-electric-600 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (Max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'thumbnail')}
                        className="hidden"
                      />
                    </label>
                    {thumbnailUrl && (
                      <div className="flex-shrink-0">
                        <img src={thumbnailUrl} alt="Thumbnail" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Or paste image URL..."
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image (Article Page)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* OG Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Share Image (OG Image)</label>
                  <input
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/og-image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">Recommended: 1200x630px</p>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">techandaidaily.com/article/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="article-slug-here"
                    />
                  </div>
                </div>

                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title ({metaTitle.length}/70)
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value.slice(0, 70))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="SEO optimized title..."
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description ({metaDescription.length}/160)
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Brief description for search engines..."
                  />
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                {/* Preview */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Search Preview</h4>
                  <div className="bg-white p-3 rounded">
                    <div className="text-blue-600 text-lg font-medium truncate">
                      {metaTitle || title || 'Article Title'}
                    </div>
                    <div className="text-green-700 text-xs truncate mt-1">
                      techandaidaily.com/article/{slug || 'article-slug'}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {metaDescription || summary || 'Article description will appear here...'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => window.location.hash = '#/'}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPublishing || uploading}
                className="px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Publish Article</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
