import React from 'react';

// FIX: Added onClick prop to Logo component to allow it to be clickable.
export const Logo: React.FC<{ className?: string, onClick?: React.MouseEventHandler<SVGSVGElement> }> = ({ className, onClick }) => (
  <svg onClick={onClick} className={className} viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 0L0 50H16L30 22L44 50H60L35 0H25Z" fill="url(#gradient-a)"/>
    <defs>
      <linearGradient id="gradient-a" x1="0" y1="0" x2="60" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A78BFA"/>
        <stop offset="1" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    <text x="65" y="35" fontFamily="sans-serif" fontSize="30" fontWeight="bold" fill="#FFFFFF">
      Ani
    </text>
    <text x="100" y="35" fontFamily="sans-serif" fontSize="30" fontWeight="300" fill="#E5E7EB">
      TV
    </text>
  </svg>
);


export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.536 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

export const VideoCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" />
  </svg>
);

export const DocumentDuplicateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);

export const AdminIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.554-.221m-1.664 1.447a11.954 11.954 0 0 1-2.928 3.013M14.25 21a2.236 2.236 0 0 1-2.23-1.53l-.555-2.217m-1.664-1.447a11.953 11.953 0 0 1-2.928-3.013m0 0a3.003 3.003 0 0 0-3.655 0M12 21a2.236 2.236 0 0 0 2.23-1.53l.555-2.217m1.664-1.447a11.953 11.953 0 0 0 2.928-3.013m0 0a3.003 3.003 0 0 1 3.655 0m-14.3 0a3.003 3.003 0 0 1 3.655 0m1.664 1.447a11.953 11.953 0 0 1 2.928 3.013M3.75 12a3.003 3.003 0 0 0 3.655 0m1.664-1.447a11.953 11.953 0 0 0 2.928-3.013m0 0a3.003 3.003 0 0 1-3.655 0m14.3 0a3.003 3.003 0 0 0-3.655 0M12 3.75a3.003 3.003 0 0 0-3.655 0m1.664 1.447a11.953 11.953 0 0 0-2.928 3.013" />
    </svg>
);
