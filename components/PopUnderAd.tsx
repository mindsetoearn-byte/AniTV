import React, { useEffect } from 'react';

const SCRIPT_ID = 'effectivegatecpm-script';
const SCRIPT_SRC = '//pl28113364.effectivegatecpm.com/25/cb/e5/25cbe54f973bf7df5160ad6d13790bf1.js';

/**
 * This component loads the ad script for multiple ad formats like Pop-unders and Social Bars.
 * The ad network script is designed to be loaded once to manage all its ad placements.
 */
export const PopUnderAd: React.FC = () => {
    useEffect(() => {
        // Check if the script has already been added to avoid duplicates.
        if (document.getElementById(SCRIPT_ID)) {
            return;
        }

        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.type = 'text/javascript';
        script.src = SCRIPT_SRC;
        script.async = true;

        document.body.appendChild(script);

        // We don't clean up the script on unmount because ad network scripts
        // are typically meant to run for the entire page session.
    }, []);

    // This component does not render any visible UI itself.
    return null;
};
