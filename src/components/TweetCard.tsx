import React, { useState } from 'react';
import { Copy, Check, Clock } from 'lucide-react';
// Removed local storage utils
// import { storageUtils } from '../utils/storage';

interface Tweet {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

interface TweetCardProps {
  tweet: Tweet;
  isCopied: boolean; // This now comes from the shared Supabase state
  onCopy: (tweet: Tweet) => Promise<boolean>;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, isCopied, onCopy }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopy = async () => {
    // Allow clicking if not already copied and not loading
    if (isCopied || isLoading) return;

    setIsLoading(true);
    const success = await onCopy(tweet);

    if (success) {
      setShowSuccess(true);
      // Success message duration
      setTimeout(() => setShowSuccess(false), 2000);
    }

    setIsLoading(false);
  };

  const formatTimestamp = (timestamp: string) => {
    // Use a more robust date parsing if timestamp format varies
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Invalid timestamp format:", timestamp, e);
      return "Invalid Date";
    }
  };

  // Removed getCopyInfo as local expiration is no longer relevant
  // const getCopyInfo = () => {
  //   const copyInfo = storageUtils.getTweetCopyInfo(tweet.id);
  //   if (!copyInfo) return null;

  //   const timeLeft = copyInfo.expiresAt - Date.now();
  //   const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

  //   return `Available in ${hoursLeft}h`;
  // };

  return (
    <div className={`bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 ${isCopied ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-white/60 text-xs">
          {formatTimestamp(tweet.timestamp)}
        </div>

        <button
          onClick={handleCopy}
          disabled={isCopied || isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            isCopied
              ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              : showSuccess
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : showSuccess ? (
            <Check className="h-4 w-4" />
          ) : isCopied ? (
            // Use Clock icon for copied state
            <Clock className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {showSuccess ? 'Copied!' : isCopied ? 'Copied' : 'Copy'}
          </span>
        </button>
      </div>

      <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">
        {tweet.text}
      </div>

      {/* Removed local expiration info display */}
      {/* {isCopied && (
        <div className="mt-3 text-xs text-yellow-300 flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{getCopyInfo()}</span>
        </div>
      )} */}
    </div>
  );
};

export default TweetCard;
