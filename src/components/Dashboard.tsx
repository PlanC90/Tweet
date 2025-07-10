import React from 'react';
import { BarChart3, Users, Copy, MessageSquare } from 'lucide-react';

interface DashboardProps {
  stats: {
    totalTweets: number;
    todayTweets: number;
    uniqueAuthors: number;
    totalCopied: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const statCards = [
    {
      icon: MessageSquare,
      label: 'Total Tweets',
      value: stats.totalTweets,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BarChart3,
      label: 'Today\'s Tweets',
      value: stats.todayTweets,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      label: 'Active Authors',
      value: stats.uniqueAuthors,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Copy,
      label: 'Copied Today',
      value: stats.totalCopied,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{card.label}</p>
              <p className="text-white text-2xl font-bold mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;