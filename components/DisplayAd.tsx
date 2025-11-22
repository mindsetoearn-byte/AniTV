import React, { useEffect, useRef } from 'react';

// This component is now for the 'highperformanceformat.com' ad network.
export const DisplayAd: React.FC<{ className?: string }> = ({ className }) => {
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Use a flag to prevent script from being added multiple times on re-renders
        if (adContainerRef.current && adContainerRef.current.children.length === 0) {
            const container = adContainerRef.current;
            
            const configScript = document.createElement('script');
            configScript.type = 'text/javascript';
            // Using innerHTML to set the script content
            configScript.innerHTML = `
                atOptions = {
                    'key' : '0c27698d9c32dc5755e0a1a23f712d4f',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                };
            `;

            const adScript = document.createElement('script');
            adScript.type = 'text/javascript';
            adScript.src = '//www.highperformanceformat.com/0c27698d9c32dc5755e0a1a23f712d4f/invoke.js';
            adScript.async = true;

            container.appendChild(configScript);
            container.appendChild(adScript);
        }
    }, []);

    return (
        <div ref={adContainerRef} className={`w-full max-w-[728px] mx-auto flex justify-center items-center ${className}`} style={{ minHeight: '90px' }}>
            {/* Ad from highperformanceformat.com will be loaded here */}
        </div>
    );
};
