import React, { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Stack, Typography, Button, Box, Card, CardMedia, CardActions, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import LikeDislikeButtons from '@/components/likeDislikeButtons';

// Keyframe animations for sliding
const slideRight = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;

const slideLeft = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-100%); opacity: 0; }
`;

const fadeIn = keyframes`
  0% { transform: translateX(50%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

export default function RecommendationEnginePage() {
  const router = useRouter();
  const { userID, email } = router.query; // Extract user ID from the query parameters
  const [loading, setLoading] = useState(true);
  const [allPets, setAllPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [nextRoundDialogOpen, setNextRoundDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (userID) fetchRecommendations(); // Fetch recommendations once userID is available
  }, [userID]);

  const parseAttribute = (attribute) => {
    const [type, value] = attribute.split(':');
    return { type: type.trim(), value: value.trim() };
  };

  const groupAttributes = (attributes) => {
    return attributes.reduce((grouped, { type, value }) => {
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(value);
      return grouped;
    }, {});
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/RecEng/recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Number(userID)), // Pass userID in the request body
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const pets = await response.json();

      const formattedPets = pets.map((pet) => {
        const attributes = pet.attributes.map(parseAttribute);
        const groupedAttributes = groupAttributes(attributes);
        const imageUrl = pet.profilePicture
          ? `data:image/png;base64,${pet.profilePicture.imageData}`
          : '/petImages/DEFAULT_IMG-612x612.jpg';

        return {
          id: pet.id,
          name: pet.name,
          groupedAttributes,
          imageUrl,
          adoptionCenter: pet.center?.centerName || 'Unknown',
        };
      });

      setAllPets(formattedPets);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const addLikedPet = async (petID) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/likedPets/addPet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: Number(userID), petId: petID }),
      });

      if (!response.ok) throw new Error('Failed to add liked pet');
      setSnackbarMessage('Pet added to liked list!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding liked pet:', error);
      setSnackbarMessage('Failed to add pet to liked list.');
      setSnackbarOpen(true);
    }
  };

  const updateUserPreferences = async (petID, liked) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/RecEng/ratePet`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: Number(userID),
          petId: petID,
          like: liked,
        }),
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  const handleViewLikedPets = () => {
    router.push(`/viewUserPets?email=${email}&userID=${userID}`);
  };

  const handleYes = () => {
    const currentPetID = allPets[currentIndex]?.id;
    if (currentPetID) {
      addLikedPet(currentPetID);
      updateUserPreferences(currentPetID, true); // Update preferences for 'like'
    }

    setAnimationDirection('left');
    incrementProgress();
    handleNextPet();
  };

  const handleNo = () => {
    const currentPetID = allPets[currentIndex]?.id;
    if (currentPetID) {
      updateUserPreferences(currentPetID, false); // Update preferences for 'dislike'
    }

    setAnimationDirection('right');
    incrementProgress();
    handleNextPet();
  };

  const incrementProgress = () => {
    setProgressValue((prev) => {
      const newValue = Math.min(prev + 1, 10);
      if (newValue === 10) setNextRoundDialogOpen(true);
      return newValue;
    });
  };
  const handleAdopt = (pet) => {
    if (pet) {
      const adoptionCenterName = encodeURIComponent(pet.adoptionCenter); // Encode the name to make it URL-safe
      router.push(`/message?email=${email}&userID=${userID}&centerName=${adoptionCenterName}`);
    }
};

  const handleNextPet = () => {
    setAnimationDirection(null);
    setCurrentIndex((prev) => (prev + 1) % allPets.length);
  };

  const handleDialogClose = () => {
    setNextRoundDialogOpen(false);
  };

  const handleStartNextRound = () => {
    setProgressValue(0);
    setNextRoundDialogOpen(false);
  };

  return (
    <main>
      <NavBar />
      <Stack sx={{ paddingTop: 2 }} alignItems="center" gap={2}>
        <Typography variant="h3">Start Matching!</Typography>
        {loading ? (
          <Typography>Loading recommendations...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <LinearProgress variant="determinate" value={(progressValue / 10) * 100} />
            </Box>
            <Card
              sx={{
                maxWidth: 600,
                animation: animationDirection
                  ? animationDirection === 'left'
                    ? `${slideLeft} 0.5s forwards`
                    : `${slideRight} 0.5s forwards`
                  : `${fadeIn} 0.5s ease-in-out`,
              }}
            >
              <CardMedia
                component="img"
                alt="Pet Image"
                height="500"
                src={allPets[currentIndex]?.imageUrl || '/petImages/DEFAULT_IMG-612x612.jpg'}
              />
              <Box sx={{ padding: 3 }}>
                <Typography><strong>Adoption Center:</strong> {allPets[currentIndex]?.adoptionCenter}</Typography>
                <Typography><strong>Name:</strong> {allPets[currentIndex]?.name}</Typography>
                {Object.entries(allPets[currentIndex]?.groupedAttributes || {}).map(([type, values], idx) => (
                  <Typography key={idx}>
                    <strong>{type}:</strong> {values.join(', ')}
                  </Typography>
                ))}
              </Box>
              <CardActions>
                <LikeDislikeButtons
                  handleLike={handleYes}
                  handleDislike={handleNo}
                  handleAdopt={() => handleAdopt(allPets[currentIndex])} // Pass the current pet
                />
              </CardActions>
            </Card>
          </>
        )}
        <Dialog open={nextRoundDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>End of Round</DialogTitle>
          <DialogContent>
            <Typography>You've reached the end of this round. Start a new round or view liked pets?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleStartNextRound}>Next Round</Button>
            <Button onClick={handleViewLikedPets}>View Liked Pets</Button>
            <Button onClick={handleDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          autoHideDuration={2000}
          message={snackbarMessage}
        />
      </Stack>
    </main>
  );
}