import React from 'react';
import { keyframes } from '@emotion/react';
import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Keyframe animations
const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
`;

// Custom button styles
const buttonStyles = (isLiked) => ({
  '&:hover': {
    animation: `${pop} 0.3s ease-in-out`,
    backgroundColor: isLiked ? '#4caf50' : '#f44336',
  },
  '&:active': {
    animation: `${pop} 0.3s ease-in-out`,
  },
  backgroundColor: isLiked ? '#3f51b5' : '#9c27b0',
  color: '#ffffff',
  fontSize: '1rem',
  padding: '12px',
});

const adoptButtonStyles = {
  backgroundColor: '#2196f3',
  color: '#ffffff',
  fontSize: '1rem',
  padding: '12px',
  '&:hover': {
    animation: `${pop} 0.3s ease-in-out`,
    backgroundColor: '#1976d2',
  },
  '&:active': {
    animation: `${pop} 0.3s ease-in-out`,
  },
};

export default function LikeDislikeButtons({ handleLike, handleDislike, handleAdopt }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      {/* Like Button */}
      <Button
        size="medium"
        onClick={handleLike}
        sx={buttonStyles(true)}
        startIcon={<CheckCircleIcon sx={{ fontSize: 60 }} />}
      />

      {/* Adopt Button */}
      <Button
        size="medium"
        onClick={handleAdopt}
        sx={adoptButtonStyles}
        startIcon={<FavoriteIcon sx={{ fontSize: 60 }} />}
      >
        Adopt
      </Button>

      {/* Dislike Button */}
      <Button
        size="medium"
        onClick={handleDislike}
        sx={buttonStyles(false)}
        startIcon={<CancelIcon sx={{ fontSize: 60 }} />}
      />
    </div>
  );
}
