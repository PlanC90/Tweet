import React from 'react';
// Removed lucide-react imports as they are no longer used

interface DashboardProps {
  stats: {
    totalTweets: number;
    todayTweets: number;
    uniqueAuthors: number;
    totalCopied: number;
  };
}

// This component no longer renders anything
const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  // The statCards data structure is no longer used for rendering,
  // but the component still receives stats props.
  // Returning null as the component is removed from the UI.
  return null;
};

export default Dashboard;
