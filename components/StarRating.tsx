
import React from 'react';

// A single star component that can be full, empty, or partially filled
const Star: React.FC<{ fillPercentage: number }> = ({ fillPercentage }) => {
    const starId = React.useId();
    // Clamp the value between 0 and 100
    const fillValue = Math.max(0, Math.min(100, fillPercentage));

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <defs>
                <linearGradient id={starId}>
                    <stop offset={`${fillValue}%`} stopColor="#FBBF24" />
                    <stop offset={`${fillValue}%`} stopColor="#475569" />
                </linearGradient>
            </defs>
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={`url(#${starId})`}
                stroke="#FBBF24"
            />
        </svg>
    );
};


interface StarRatingProps {
    rating: number;
    totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
    const stars = Array.from({ length: totalStars }, (_, i) => {
        const starNumber = i + 1;
        let fillPercentage = 0;
        if (starNumber <= rating) {
            fillPercentage = 100;
        } else if (starNumber > rating && starNumber - 1 < rating) {
            fillPercentage = (rating - Math.floor(rating)) * 100;
        }
        return <Star key={i} fillPercentage={fillPercentage} />;
    });

    return <div className="flex items-center">{stars}</div>;
};

export default StarRating;
