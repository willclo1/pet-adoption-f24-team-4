import React from 'react';
import { keyframes } from '@emotion/react';
import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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
    color: isLiked ? '#4caf50' : '#f44336',
  },
  '&:active': {
    animation: `${pop} 0.3s ease-in-out`,
  }
});

export default function LikeDislikeButtons({ handleLike, handleDislike }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '200px' }}>
      {/* Like Button */}
      <Button
        size="large"
        color="primary"
        onClick={handleLike}
        sx={buttonStyles(true)}
        startIcon={<CheckCircleIcon sx={{ fontSize: 60 }} />}
      />

      {/* Dislike Button */}
      <Button
        size="large"
        color="secondary"
        onClick={handleDislike}
        sx={buttonStyles(false)}
        startIcon={<CancelIcon sx={{ fontSize: 60 }} />}
      />
    </div>
  );
}
