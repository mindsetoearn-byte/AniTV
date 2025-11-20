import React, { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface DisplayAdProps {
    adSlot: string;
    className?: string;
}

export const DisplayAd: React.FC<DisplayAdProps> = ({ adSlot, className = '' }) => {
    const adRef = useRef<HTMLDivElement>(null);
    const [isAdLoaded, setIsAdLoaded] = useState(false);

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsAdLoaded(true);
        } catch (e) {
            console.error("AdSense error: ", e);
            setIsAdLoaded(false);
        }
    }, []);

    // Show a skeleton loader while the ad is loading to prevent layout shift.
    // If AdSense fails to load or is blocked, this will eventually collapse.
    if (!isAdLoaded) {
      return (
        <div className={`w-full bg-gray-800 animate-pulse rounded-lg flex items-center justify-center ${className}`} style={{ minHeight: '100px' }}>
          <span className="text-gray-500 text-sm">Advertisement</span>
        </div>
      );
    }

    return (
        <div ref={adRef} className={`w-full overflow-hidden ${className}`}>
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // IMPORTANT: Replace with your publisher ID
                 data-ad-slot={adSlot}
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
    );
};