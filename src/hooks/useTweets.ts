import { useState, useEffect } from 'react';
import tweetsData from '../data/tweets.json';
import { storageUtils } from '../utils/storage';

interface Tweet {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

export const useTweets = () => {
  const [tweets] = useState<Tweet[]>(tweetsData);
  const [copiedTweets, setCopiedTweets] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tweetsPerPage = 50;

  useEffect(() => {
    const updateCopiedTweets = () => {
      const copied = storageUtils.getCopiedTweets();
      setCopiedTweets(copied.map(tweet => tweet.id));
    };

    updateCopiedTweets();
    
    // Update every minute to handle expiration
    const interval = setInterval(updateCopiedTweets, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const copyTweet = async (tweet: Tweet) => {
    try {
      await navigator.clipboard.writeText(tweet.text);
      storageUtils.markTweetAsCopied(tweet.id);
      setCopiedTweets(prev => [...prev.filter(id => id !== tweet.id), tweet.id]);
      return true;
    } catch (error) {
      console.error('Failed to copy tweet:', error);
      return false;
    }
  };

  const getTotalPages = () => Math.ceil(tweets.length / tweetsPerPage);

  const getCurrentPageTweets = () => {
    const startIndex = (currentPage - 1) * tweetsPerPage;
    const endIndex = startIndex + tweetsPerPage;
    return tweets.slice(startIndex, endIndex);
  };

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTweets = tweets.filter(tweet => 
      tweet.timestamp.startsWith(today)
    );
    
    const uniqueAuthors = new Set(todayTweets.map(tweet => tweet.author)).size;
    const totalCopied = copiedTweets.length;
    
    return {
      totalTweets: tweets.length,
      todayTweets: todayTweets.length,
      uniqueAuthors,
      totalCopied
    };
  };

  return {
    tweets,
    copiedTweets,
    currentPage,
    setCurrentPage,
    tweetsPerPage,
    copyTweet,
    getTotalPages,
    getCurrentPageTweets,
    getStats,
    isTweetCopied: (id: number) => copiedTweets.includes(id)
  };
};
