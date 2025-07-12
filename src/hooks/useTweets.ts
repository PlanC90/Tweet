import { useState, useEffect, useCallback } from 'react';
import tweetsData from '../data/tweets.json';
// Supabase import is no longer needed
// import { supabase } from '../supabaseClient';
// User type is no longer needed
// import { User } from '@supabase/supabase-js';

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

// Key for local storage
const LOCAL_STORAGE_KEY = 'copiedTweetIds';

export const useTweets = () => {
  // User state and related effects removed
  // const [user, setUser] = useState<User | null>(null);
  // const [loadingUser, setLoadingUser] = useState(true);

  // Initialize allTweets defensively, ensuring tweetsData is an array
  const [allTweets] = useState<Tweet[]>(() => {
    // Check if tweetsData is an array before spreading and shuffling
    const dataToShuffle = Array.isArray(tweetsData) ? tweetsData : [];
    return shuffleArray([...dataToShuffle]);
  });

  // Initialize copiedTweetIds from local storage
  const [copiedTweetIds, setCopiedTweetIds] = useState<number[]>(() => {
    try {
      const storedIds = localStorage.getItem(LOCAL_STORAGE_KEY);
      // Ensure parsed data is an array, default to empty array if null or not array
      const parsedIds = storedIds ? JSON.parse(storedIds) : null;
      return Array.isArray(parsedIds) ? parsedIds : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const tweetsPerPage = 50;
  // loadingCopied state is no longer needed as we use local storage
  const [loadingCopied, setLoadingCopied] = useState(false); // Set to false as no async fetch

  // Effect to get the initial user session and listen for auth changes - REMOVED
  // useEffect(() => { ... }, []);

  // Fetch copied tweets for the current user whenever the user changes - REMOVED
  // const fetchCopiedTweets = useCallback(async () => { ... }, [user]);

  // Effect to fetch copied tweets on mount (or user change) - MODIFIED for localStorage
  useEffect(() => {
    // No need to fetch from Supabase, state is initialized from localStorage
    // The initial state setter already handles reading from localStorage
    // This effect can be used for other side effects if needed, but not for fetching copied state
    setLoadingCopied(false); // Ensure loading is false after initial state setup
  }, []); // Empty dependency array means this runs once on mount

  // Effect to save copiedTweetIds to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(copiedTweetIds));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [copiedTweetIds]); // Depend on copiedTweetIds state

  const copyTweet = async (tweet: Tweet) => {
    // No user check needed

    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(tweet.text);

      // Update local state immediately
      // Add the tweet ID to the copiedTweetIds array if it's not already there
      if (!copiedTweetIds.includes(tweet.id)) {
         setCopiedTweetIds(prevIds => [...prevIds, tweet.id]);
      }

      // No Supabase interaction needed here

      return true; // Indicate success
    } catch (error) {
      console.error('Failed to copy tweet or update local storage:', error);
      return false; // Indicate failure
    }
  };

  const getTotalPages = () => Math.ceil(allTweets.length / tweetsPerPage);

  const getCurrentPageTweets = () => {
    // Add a defensive check for allTweets being an array before filtering
    if (!Array.isArray(allTweets)) {
        console.error("allTweets is not an array when getCurrentPageTweets is called:", allTweets);
        return []; // Return an empty array to prevent the error
    }

    // Separate tweets into copied (locally) and uncopied
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
    // Add a defensive check for allTweets being an array before filtering
    if (!Array.isArray(allTweets)) {
        console.error("allTweets is not an array when getStats is called:", allTweets);
        return {
            totalTweets: 0,
            todayTweets: 0,
            uniqueAuthors: 0,
            totalCopied: copiedTweetIds.length // totalCopied can still be calculated from local storage
        };
    }

    const today = new Date().toISOString().split('T')[0];
    const todayTweets = allTweets.filter(tweet =>
      tweet.timestamp.startsWith(today)
    );

    const uniqueAuthors = new Set(todayTweets.map(tweet => tweet.author)).size;
    // Total copied is now based on the local storage state
    const totalCopied = copiedTweetIds.length;

    return {
      totalTweets: allTweets.length,
      todayTweets: todayTweets.length,
      uniqueAuthors,
      totalCopied
    };
  };

  return {
    tweets: getCurrentPageTweets(), // Return paginated and ordered tweets
    copiedTweetIds, // Return the list of copied IDs (from local storage)
    currentPage,
    setCurrentPage,
    tweetsPerPage,
    copyTweet,
    getTotalPages,
    getStats,
    isTweetCopied: (id: number) => copiedTweetIds.includes(id),
    loadingCopied, // Still expose, but it will be false quickly
    // user and loadingUser are removed
    // user: null,
    // loadingUser: false
  };
};
