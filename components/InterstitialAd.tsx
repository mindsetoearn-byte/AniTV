import React, { useEffect, useState } from 'react';
import { SpinnerIcon } from './icons';

declare global {
  interface Window {
    googletag: any;
  }
}

interface InterstitialAdProps {
    adUnitId: string;
    onAdClosed: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ adUnitId, onAdClosed }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.googletag = window.googletag || { cmd: [] };
            window.googletag.cmd.push(() => {
                const interstitialSlot = window.googletag.defineOutOfPageSlot(
                    adUnitId,
                    window.googletag.enums.OutOfPageFormat.INTERSTITIAL
                );

                if (interstitialSlot) {
                    interstitialSlot.addService(window.googletag.pubads());
                    window.googletag.pubads().addEventListener('slotOnload', () => {
                         setIsLoading(false);
                    });
                     window.googletag.pubads().addEventListener('impressionViewable', () => {
                         setIsLoading(false); // Ad is now visible
                    });
                    window.googletag.pubads().addEventListener('slotRenderEnded', (event: any) => {
                        if (event.isEmpty) {
                            // Ad slot was empty, close immediately
                            onAdClosed();
                        }
                    });
                    window.googletag.addEventListener('pubadsReady', () => {
                       window.googletag.display(interstitialSlot);
                    });
                    window.googletag.pubads().addEventListener('slotClosed', () => {
                        onAdClosed();
                    });
                } else {
                     console.error("Failed to define interstitial ad slot.");
                     onAdClosed(); // Fail gracefully
                }
                
                window.googletag.enableServices();
            });
        };
        
        script.onerror = () => {
          console.error("Failed to load Google Publisher Tag script.");
          onAdClosed(); // Fail gracefully if script is blocked
        };

        return () => {
          // Cleanup script and googletag object if component unmounts
          document.head.removeChild(script);
          if(window.googletag && window.googletag.destroySlots) {
            window.googletag.destroySlots();
          }
        };

    }, [adUnitId, onAdClosed]);

    if (!isLoading) {
        return null; // Ad is displayed by Google's script in an iframe, we just need the overlay
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-[200] flex flex-col items-center justify-center animate-fadeIn">
            <SpinnerIcon className="w-16 h-16 text-purple-500 animate-spin" />
            <p className="text-gray-300 mt-4">Loading Advertisement...</p>
        </div>
    );
};
