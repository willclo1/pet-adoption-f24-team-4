import React, { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Stack, Typography, Button, Box, Card, CardMedia, CardActions, Drawer, Snackbar, Backdrop, LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import LikeDislikeButtons from '@/components/likeDislikeButtons';
import { format } from 'date-fns';

// Keyframe animations for sliding left and right
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
  const { adoptionID, email } = router.query;
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [allPets, setAllPets] = useState([]);
  const [allPetDetails, setAllPetDetails] = useState([]);
  const [progressValue, setProgressValue] = useState(0); // Progress value from 0 to 10
  const petsPerRound = 10;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        const petsRes = await fetch(`${apiUrl}/pets`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!petsRes.ok) throw new Error('Failed to fetch pet data');

        const petsData = await petsRes.json();
        const formattedPets = petsData.map(pet => ({
          ...pet,
          name: formatOption(pet.name),
          species: formatOption(pet.species),
          coatLength: formatOption(pet.coatLength),
          furType: formatOption(pet.furType),
          petSize: formatOption(pet.petSize),
          healthStatus: formatOption(pet.healthStatus),
          sex: formatOption(pet.sex),
          furColor: pet.furColor.map(color => formatOption(color)),
          temperament: pet.temperament.map(temp => formatOption(temp)),
          dogBreed: pet.dogBreed ? pet.dogBreed.map(breed => formatOption(breed)) : [],
          catBreed: pet.catBreed ? pet.catBreed.map(breed => formatOption(breed)) : [],
          profilePicture: pet.profilePicture ? `data:image/png;base64,${pet.profilePicture.imageData}` : '/petImages/DEFAULT_IMG-612x612.jpg'
        }));
        console.log("Pets:", formattedPets);

        setAllPets(formattedPets.map(pet => pet.profilePicture));
        setAllPetDetails(formattedPets);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setError("Failed to load pets.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [apiUrl]);

  const formatOption = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

  // Function to handle yes or no button click
  const handleYes = () => {
    setIsLiked(true);
    setAnimationDirection('left');
    setSnackbarOpen(true);
    setTimeout(() => {
      incrementProgress();
      handleNextPet();
    }, 500);
  };

  const handleNo = () => {
    setIsLiked(false);
    setAnimationDirection('right');
    setSnackbarOpen(true);
    setTimeout(() => {
      incrementProgress();
      handleNextPet();
    }, 500);
  };

  // Increment the progress value
  const incrementProgress = () => {
    setProgressValue((prevValue) => Math.min(prevValue + 1, 10)); // Increment up to 10
  };

  const handleNextPet = () => {
    setAnimationDirection(null);
    setCurrentIndex((prevIdx) => (prevIdx + 1) % allPets.length);
  };

  // Function to fetch user data
  const fetchUserData = async (email) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/email/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUser(data);
      if (data.profilePicture && data.profilePicture.imageData) {
        setProfilePicture(`data:image/png;base64,${data.profilePicture.imageData}`);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleAdopt = () => {
    setShowBackdrop(true);
    setTimeout(() => {
      setShowBackdrop(false);
    }, 1000);
  };

  return (
    <main>
      <NavBar />

      <Backdrop
        sx={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'green', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <Typography variant="h3" color="primary">Congratulations on choosing to adopt!</Typography>
      </Backdrop>

      <Stack sx={{ paddingTop: 2 }} alignItems="center" gap={2}>
        <Typography variant="h3">Start Matching!</Typography>
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <LinearProgress variant="determinate" value={(progressValue / 10) * 100} sx={{ marginBottom: 2 }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}>
          <Card
            key={currentIndex}
            sx={{
              maxWidth: 600,
              animation: animationDirection === 'left' ? `${slideLeft} 0.5s forwards` : animationDirection === 'right' ? `${slideRight} 0.5s forwards` : `${fadeIn} 0.5s ease-in-out`
            }}
          >
            <CardMedia
              component="img"
              alt="Pet Image"
              height="500"
              width="400"
              src={allPets[currentIndex]} // Replace with real image URL
              sx={{ objectFit: 'cover' }}
            />
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <LikeDislikeButtons handleLike={handleYes} handleDislike={handleNo} handleAdopt={handleAdopt} />
            </CardActions>

            <Box sx={{ padding: 3 }}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Name:</strong> {allPetDetails[currentIndex]?.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Species:</strong> {allPetDetails[currentIndex]?.species}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Coat Length:</strong> {allPetDetails[currentIndex]?.coatLength}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Fur Type:</strong> {allPetDetails[currentIndex]?.furType}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Pet Size:</strong> {allPetDetails[currentIndex]?.petSize}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Health Status:</strong> {allPetDetails[currentIndex]?.healthStatus}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Temperament:</strong> {allPetDetails[currentIndex]?.temperament?.join(', ')}
              </Typography>
            </Box>
          </Card>
        </Box>

        <Button onClick={() => setProgressValue(0)}>Next Round</Button>

        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          autoHideDuration={2000}
          message={isLiked ? "You liked this pet!" : "You disliked this pet."}
        />
      </Stack>
    </main>
  );
}
