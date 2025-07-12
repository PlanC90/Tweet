import React, { useState, useEffect } from 'react'; // Import useEffect
import { Copy, Check, Clock } from 'lucide-react';

interface Tweet {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

interface TweetCardProps {
  tweet: Tweet;
  isCopied: boolean; // This now means 'is copied by the current user'
  onCopy: (tweet: Tweet) => Promise<boolean>;
  isAuthenticated: boolean; // Prop to indicate if a user is logged in
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, isCopied, onCopy, isAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // New state to show "sql" text after successful copy by this user
  const [showSqlText, setShowSqlText] = useState(false);

  // Effect to set initial state based on isCopied prop
  useEffect(() => {
    if (isCopied) {
      setShowSqlText(true); // If already copied by this user, show "sql" initially
    } else {
      setShowSqlText(false); // If not copied by this user, ensure "sql" is not shown
    }
  }, [isCopied]); // Re-run if isCopied status changes

  const handleCopy = async () => {
    // Allow clicking only if authenticated, not already copied by this user, and not loading
    if (!isAuthenticated || isCopied || isLoading) return;

    setIsLoading(true);
    const success = await onCopy(tweet);

    if (success) {
      setShowSuccess(true);
      setShowSqlText(true); // Show "sql" text on successful copy
      // Success message duration
      setTimeout(() => setShowSuccess(false), 2000);
    }

    setIsLoading(false);
  };

  const formatTimestamp = (timestamp: string) => {
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

  // Determine button text based on states
  const buttonText = showSuccess ? 'Copied!' : showSqlText ? 'sql' : 'Copy';

  // Determine button icon based on states
  const buttonIcon = isLoading ? (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : showSuccess ? (
    <Check className="h-4 w-4" />
  ) : showSqlText ? ( // Show Clock icon when showing "sql" text
    <Clock className="h-4 w-4" />
  ) : (
    <Copy className="h-4 w-4" />
  );

  // Determine button class based on states and authentication
  const buttonClass = `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
    isLoading
      ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
      : showSuccess
      ? 'bg-green-500 text-white'
      : showSqlText // Apply faded style when showing "sql" (meaning it's copied by this user)
      ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed opacity-70'
      : isAuthenticated // If authenticated and not copied, show blue copy button
      ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
      : 'bg-gray-500/50 text-gray-300 cursor-not-allowed' // If not authenticated, disable and fade
  }`;

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="text-white/60 text-xs">
          {formatTimestamp(tweet.timestamp)}
        </div>

        <button
          onClick={handleCopy}
          disabled={!isAuthenticated || isCopied || isLoading} // Disable if not authenticated, already copied, or loading
          className={buttonClass}
        >
          {buttonIcon}
          <span className="text-sm font-medium">
            {buttonText}
          </span>
        </button>
      </div>

      <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">
        {tweet.text}
      </div>
    </div>
  );
};

export default TweetCard;
