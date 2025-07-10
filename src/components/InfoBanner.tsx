import React from 'react';
import { Info, Shield, Clock } from 'lucide-react';

const InfoBanner: React.FC = () => {
  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30 mb-8">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Info className="h-6 w-6 text-blue-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-2">How the System Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">Copy Protection</p>
                <p>Each tweet can only be copied once per user to prevent duplicates.</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">24-Hour Cooldown</p>
                <p>Copied tweets remain faded for 24 hours before becoming available again.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
