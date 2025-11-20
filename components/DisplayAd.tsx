import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface DisplayAdProps {
    adSlot: string;
    publisherId: string;
    className?: string;
}

export const DisplayAd: React.FC<DisplayAdProps> = ({ adSlot, publisherId, className = '' }) => {
    const adRef = useRef<HTMLDivElement>(null);
    const hasPushed = useRef(false);

    useEffect(() => {
        if (!adRef.current || hasPushed.current) {
            return;
        }

        const adContainer = adRef.current;
        
        // This function attempts to push the ad.
        const attemptAdPush = () => {
            // Check if the container is rendered and has a width, and hasn't been filled.
            if (adContainer.clientWidth > 0 && !adContainer.querySelector('iframe')) {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    hasPushed.current = true; // Mark that we've pushed this ad slot
                } catch (e) {
                    console.error("AdSense push error: ", e);
                }
            }
        };
        
        // Use a short timeout to let the DOM stabilize, especially for ads in modals.
        const timer = setTimeout(attemptAdPush, 100);

        return () => {
            clearTimeout(timer);
        };

    }, [adSlot, publisherId]);

    // The key is crucial. It forces React to re-mount the component when the adSlot changes,
    // resetting the refs and useEffect for a clean ad request.
    return (
        <div key={adSlot} ref={adRef} className={`w-full overflow-hidden flex justify-center items-center bg-gray-800/50 rounded-lg ${className}`} style={{ minHeight: '90px' }}>
            <ins className="adsbygoogle"
                 style={{ display: 'block', width: '100%' }}
                 data-ad-client={publisherId}
                 data-ad-slot={adSlot}
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
    );
};