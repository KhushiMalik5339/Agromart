import React from 'react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  showCount = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= fullStars) {
            return (
              <span key={star} className={`material-symbols-outlined fill-1 ${sizeClasses[size]}`}>
                star
              </span>
            );
          } else if (star === fullStars + 1 && hasHalfStar) {
            return (
              <span key={star} className={`material-symbols-outlined ${sizeClasses[size]}`}>
                star_half
              </span>
            );
          } else {
            return (
              <span key={star} className={`material-symbols-outlined text-outline-variant ${sizeClasses[size]}`}>
                star
              </span>
            );
          }
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-on-surface-variant font-medium ml-1">
          ({count})
        </span>
      )}
    </div>
  );
};
