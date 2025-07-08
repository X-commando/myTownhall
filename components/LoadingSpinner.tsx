'use client';

import Logo from '@/components/Logo';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 animate-spin">
          <div className="h-full w-full rounded-full border-2 border-emerald-200 border-t-emerald-500" />
        </div>
        <div className="p-2">
          <Logo size={sizeMap[size]} animated />
        </div>
      </div>
      {text && (
        <p className="text-sm text-slate-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}