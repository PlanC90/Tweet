interface CopiedTweet {
  id: number;
  copiedAt: number;
  expiresAt: number;
}

const STORAGE_KEY = 'copiedTweets';
const COPY_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const storageUtils = {
  getCopiedTweets: (): CopiedTweet[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const copiedTweets: CopiedTweet[] = JSON.parse(stored);
      const now = Date.now();
      
      // Filter out expired tweets
      const validTweets = copiedTweets.filter(tweet => tweet.expiresAt > now);
      
      // Update storage if any tweets were removed
      if (validTweets.length !== copiedTweets.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validTweets));
      }
      
      return validTweets;
    } catch (error) {
      console.error('Error reading copied tweets:', error);
      return [];
    }
  },

  markTweetAsCopied: (tweetId: number): void => {
    try {
      const copiedTweets = storageUtils.getCopiedTweets();
      const now = Date.now();
      const expiresAt = now + COPY_DURATION;
      
      const newCopiedTweet: CopiedTweet = {
        id: tweetId,
        copiedAt: now,
        expiresAt: expiresAt
      };
      
      // Remove existing entry if present
      const filteredTweets = copiedTweets.filter(tweet => tweet.id !== tweetId);
      filteredTweets.push(newCopiedTweet);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTweets));
    } catch (error) {
      console.error('Error marking tweet as copied:', error);
    }
  },

  isTweetCopied: (tweetId: number): boolean => {
    const copiedTweets = storageUtils.getCopiedTweets();
    return copiedTweets.some(tweet => tweet.id === tweetId);
  },

  getTweetCopyInfo: (tweetId: number): CopiedTweet | null => {
    const copiedTweets = storageUtils.getCopiedTweets();
    return copiedTweets.find(tweet => tweet.id === tweetId) || null;
  }
};
