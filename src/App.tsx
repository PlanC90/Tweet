import React from 'react';
import { useTweets } from './hooks/useTweets';
// Removed Dashboard import as it is no longer used
import TweetCard from './components/TweetCard';
import Pagination from './components/Pagination';
import InfoBanner from './components/InfoBanner';
import { MessageSquare } from 'lucide-react';

function App() {
  const {
    getCurrentPageTweets,
    copyTweet,
    isTweetCopied,
    currentPage,
    setCurrentPage,
    getTotalPages,
    getStats // getStats is still called but its result is not passed to Dashboard
  } = useTweets();

  const stats = getStats(); // Stats are still calculated but not displayed in the dashboard area
  const tweets = getCurrentPageTweets();
  const totalPages = getTotalPages();

  return (
    // Changed background gradient to a dark theme
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {/* Updated header icon container for dark theme */}
            <div className="p-3 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Tweet Manager</h1>
          </div>
          <p className="text-white/80 text-lg">
            Manage your daily tweets with smart copy protection and analytics
          </p>
        </div>

        {/* Info Banner */}
        <InfoBanner />

        {/* Dashboard component removed */}

        {/* Tweets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              isCopied={isTweetCopied(tweet.id)}
              onCopy={copyTweet}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p>Showing {tweets.length} tweets • Page {currentPage} of {totalPages}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
