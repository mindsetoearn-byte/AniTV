import React from 'react';
import { DisplayAd } from './DisplayAd';
import { XIcon } from './icons';

interface InterstitialAdProps {
    onAdClosed: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onAdClosed }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative bg-gray-900 rounded-lg p-3 shadow-2xl w-full max-w-fit mx-auto">
                 <button 
                    onClick={onAdClosed} 
                    className="absolute -top-3 -right-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1.5 z-10 shadow-lg"
                    aria-label="Close ad"
                >
                    <XIcon className="w-5 h-5" />
                </button>
                <p className="text-xs text-center text-gray-500 mb-2">Advertisement</p>
                <div className="bg-gray-800 rounded-md">
                     <DisplayAd className="min-h-[90px]" />
                </div>
            </div>
        </div>
    );
};
