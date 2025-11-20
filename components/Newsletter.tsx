import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
        // Simulate API call
        setTimeout(() => setSubscribed(true), 500);
    }
  };

  return (
    <section className="bg-navy-900 py-16 border-t border-gray-800 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-electric-600 opacity-10 blur-3xl animate-pulseSlow"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-navy-800 rounded-full mb-6 shadow-lg">
            <Mail className="text-electric-600" size={24} />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
          Get the morning briefing
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Curated for builders, researchers, and tech leaders. Join 15,000+ subscribers getting the essential AI analysis every weekday.
        </p>

        {subscribed ? (
            <div className="bg-green-900/30 border border-green-800 text-green-400 p-4 rounded-lg flex items-center justify-center gap-3 animate-fadeInUp">
                <CheckCircle size={20} />
                <span className="font-medium">Welcome aboard! Check your inbox for confirmation.</span>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input 
                    type="email" 
                    placeholder="Enter your work email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-grow px-5 py-3 rounded-md bg-navy-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-600 transition-all"
                    required
                />
                <button 
                    type="submit"
                    className="bg-electric-600 text-white px-8 py-3 rounded-md font-bold hover:bg-electric-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                    Subscribe
                </button>
            </form>
        )}
        
        <p className="mt-4 text-xs text-gray-500">
            No spam. Unsubscribe anytime. Read our <a href="#" className="underline hover:text-gray-400">privacy policy</a>.
        </p>
      </div>
    </section>
  );
};