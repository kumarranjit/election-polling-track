import { useEffect, useState } from "react";

export type LoadingVariant = "spinner" | "skeleton" | "pulse" | "dots" | "fullscreen";

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Modern, mobile-first loading component with multiple variants
 * Supports spinner, skeleton, pulse, dots, and fullscreen modes
 */
const Loading = ({
  variant = "spinner",
  size = "md",
  message,
  fullScreen = false,
  className = "",
}: LoadingProps) => {
  const [dots, setDots] = useState("");

  // Animated dots effect
  useEffect(() => {
    if (variant === "dots") {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8 sm:w-10 sm:h-10",
    lg: "w-12 h-12 sm:w-16 sm:h-16",
  };

  const textSizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base",
    lg: "text-base sm:text-lg",
  };

  // Spinner variant - Modern gradient spinner
  const SpinnerLoader = () => (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
      <div
        className={`${sizeClasses[size]} relative rounded-full`}
        role="status"
        aria-label="Loading"
      >
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-500 animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-purple-500 border-l-pink-500 animate-spin animation-delay-150" style={{ animationDirection: 'reverse' }} />
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900" />
      </div>
      {message && (
        <p className={`${textSizeClasses[size]} font-medium text-slate-600 dark:text-slate-300`}>
          {message}
        </p>
      )}
    </div>
  );

  // Pulse variant - Pulsing gradient circles
  const PulseLoader = () => (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${sizeClasses[size].split(" ")[0]} ${sizeClasses[size].split(" ")[1]} rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 animate-pulse`}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1.2s",
            }}
          />
        ))}
      </div>
      {message && (
        <p className={`${textSizeClasses[size]} font-medium text-slate-600 dark:text-slate-300`}>
          {message}
        </p>
      )}
    </div>
  );

  // Dots variant - Animated text dots
  const DotsLoader = () => (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
      </div>
      {message && (
        <p className={`${textSizeClasses[size]} font-medium text-slate-600 dark:text-slate-300`}>
          {message}{dots}
        </p>
      )}
    </div>
  );

  // Skeleton variant - Modern skeleton loader
  const SkeletonLoader = () => (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 sm:w-1/2 rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]" />
          <div className="h-3 w-1/2 sm:w-1/3 rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]" />
        <div className="h-3 w-5/6 rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]" />
        <div className="h-3 w-4/6 rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]" />
      </div>
      {/* Card skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 sm:h-24 rounded-xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]"
          />
        ))}
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return <SpinnerLoader />;
      case "pulse":
        return <PulseLoader />;
      case "dots":
        return <DotsLoader />;
      case "skeleton":
        return <SkeletonLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  const content = (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "min-h-[200px] sm:min-h-[300px]"
      } ${className}`}
    >
      {renderLoader()}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="relative">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loading;
