import React from 'react';
import { useTweets } from './hooks/useTweets';
import TweetCard from './components/TweetCard';
import './index.css'; // Ensure Tailwind CSS is imported

function App() {
  const {
    tweets,
    currentPage,
    setCurrentPage,
    getTotalPages,
    copyTweet,
    isTweetCopied,
    getStats,
    // loadingCopied is no longer needed as per previous discussion
  } = useTweets();

  const stats = getStats();

  // The loading state block for loadingCopied is removed as it's no longer needed
  // and was causing a parsing error due to a misplaced parenthesis.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Updated the title text */}
        <h1 className="text-4xl font-bold text-center mb-8">MEMEX Tweet Feed</h1>

        {/* Authentication Section Removed */}
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
            <div className="text-xl font-bold">{stats.totalTweets}</div>
            <div className="text-sm text-white/70">Total Tweets</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
            <div className="text-xl font-bold">{stats.todayTweets}</div>
            <div className="text-sm text-white/70">Today's Tweets</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
            <div className="text-xl font-bold">{stats.uniqueAuthors}</div>
            <div className="text-sm text-white/70">Unique Authors (Today)</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
            <div className="text-xl font-bold">{stats.totalCopied}</div>
            <div className="text-sm text-white/70">Copied (Local)</div> {/* Updated text */}
          </div>
        </div>


        {/* Tweet List */}
        <div className="space-y-6 mb-8">
          {tweets.map(tweet => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              isCopied={isTweetCopied(tweet.id)}
              onCopy={copyTweet}
              isAuthenticated={true} // Assume authenticated for UI purposes if no auth
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {getTotalPages()}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
            disabled={currentPage === getTotalPages()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// Supabase client import is no longer needed in App.tsx
// import { supabase } from './supabaseClient';
