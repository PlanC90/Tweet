import React from 'react';
import { useTweets } from './hooks/useTweets';
import Dashboard from './components/Dashboard';
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
    getStats
  } = useTweets();

  const stats = getStats();
  const tweets = getCurrentPageTweets();
  const totalPages = getTotalPages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
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

        {/* Dashboard */}
        <Dashboard stats={stats} />

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