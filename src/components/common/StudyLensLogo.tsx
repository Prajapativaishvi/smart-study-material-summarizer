import React from 'react';

interface StudyLensLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const StudyLensLogo: React.FC<StudyLensLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-extrabold',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Lens + Learning Book Symbol */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Open Book Wings */}
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          {/* Focal Lens Aperture */}
          <circle cx="12" cy="9.5" r="3.2" strokeWidth="2" />
          {/* Focus Reticle marks */}
          <path d="M12 4.5v1.5" />
          <path d="M12 13v1.5" />
          <path d="M7 9.5h1.5" />
          <path d="M15.5 9.5H17" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`tracking-tight text-slate-900 font-display ${textSizes[size]}`}>
            Study<span className="text-blue-600">Lens</span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 self-baseline mt-1"></span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 font-medium tracking-normal -mt-0.5">
            Turn study material into your learning path
          </span>
        )}
      </div>
    </div>
  );
};
