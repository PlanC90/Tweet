import { useState, useEffect, useCallback } from 'react';
import tweetsData from '../data/tweets.json';
// Removed local storage utils as we'll use Supabase
// import { storageUtils } from '../utils/storage';
import { supabase } from '../supabaseClient';

interface Tweet {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

// Fisher-Yates (Knuth) Shuffle Algorithm
const shuffleArray = (array: Tweet[]) => {
  const shuffledArray = [...array]; // Create a mutable copy
  let currentIndex = shuffledArray.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex], shuffledArray[currentIndex]];
  }

  return shuffledArray;
};


export const useTweets = () => {
  // Shuffle tweetsData when the hook is initialized
  const [allTweets] = useState<Tweet[]>(() => shuffleArray([...tweetsData]));
  const [copiedTweetIds, setCopiedTweetIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tweetsPerPage = 50;
  const [loadingCopied, setLoadingCopied] = useState(true);

  const fetchCopiedTweets = useCallback(async () => {
    setLoadingCopied(true);
    const { data, error } = await supabase
      .from('copied_tweets')
      .select('tweet_id');

    if (error) {
      console.error('Error fetching copied tweets:', error);
      // Optionally handle error state in UI
    } else {
      setCopiedTweetIds(data.map(item => item.tweet_id));
    }
    setLoadingCopied(false);
  }, []);

  useEffect(() => {
    fetchCopiedTweets();

    // Optional: Set up real-time subscription for instant updates
    // const subscription = supabase
    //   .from('copied_tweets')
    //   .on('*', payload => {
    //     console.log('Change received!', payload);
    //     fetchCopiedTweets(); // Refetch when changes occur
    //   })
    //   .subscribe();

    // return () => {
    //   supabase.removeSubscription(subscription);
    // };

  }, [fetchCopiedTweets]); // Depend on fetchCopiedTweets

  const copyTweet = async (tweet: Tweet) => {
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(tweet.text);

      // Mark as copied in Supabase
      const { error } = await supabase
        .from('copied_tweets')
        .insert([{ tweet_id: tweet.id }]);

      if (error) {
        console.error('Error marking tweet as copied in Supabase:', error);
        // If it's a unique constraint error (already copied), it's fine.
        // Otherwise, you might want to show an error to the user.
        // For now, we'll just log it.
        if (error.code !== '23505') { // 23505 is unique_violation
             // Handle other errors if necessary
             return false; // Indicate failure if not a unique violation
        }
      }

      // Update local state by refetching from Supabase
      await fetchCopiedTweets();

      return true; // Indicate success
    } catch (error) {
      console.error('Failed to copy tweet or update Supabase:', error);
      return false; // Indicate failure
    }
  };

  const getTotalPages = () => Math.ceil(allTweets.length / tweetsPerPage);

  const getCurrentPageTweets = () => {
    // Separate tweets into copied and uncopied based on Supabase data
    const uncopiedTweets = allTweets.filter(tweet => !copiedTweetIds.includes(tweet.id));
    const copiedTweets = allTweets.filter(tweet => copiedTweetIds.includes(tweet.id));

    // Combine uncopied first, then copied. Keep original shuffled order within groups.
    const orderedTweets = [...uncopiedTweets, ...copiedTweets];

    // Apply pagination
    const startIndex = (currentPage - 1) * tweetsPerPage;
    const endIndex = startIndex + tweetsPerPage;
    return orderedTweets.slice(startIndex, endIndex);
  };

  const getStats = () => {
    // Stats logic can remain, but might need adjustment if based on *all* tweets vs displayed tweets
    // For now, keep it based on allTweets for consistency with previous version
    const today = new Date().toISOString().split('T')[0];
    const todayTweets = allTweets.filter(tweet =>
      tweet.timestamp.startsWith(today)
    );

    const uniqueAuthors = new Set(todayTweets.map(tweet => tweet.author)).size;
    const totalCopied = copiedTweetIds.length; // Use Supabase data for total copied

    return {
      totalTweets: allTweets.length,
      todayTweets: todayTweets.length,
      uniqueAuthors,
      totalCopied
    };
  };

  return {
    tweets: getCurrentPageTweets(), // Return paginated and ordered tweets
    copiedTweetIds, // Return the list of copied IDs
    currentPage,
    setCurrentPage,
    tweetsPerPage,
    copyTweet,
    getTotalPages,
    getStats,
    isTweetCopied: (id: number) => copiedTweetIds.includes(id),
    loadingCopied // Expose loading state if needed in UI
  };
};
