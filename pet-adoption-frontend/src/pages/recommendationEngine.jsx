import React, { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Stack, Typography, Button, Box, Card, CardMedia, CardActions, Drawer, Snackbar, Backdrop, LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import LikeDislikeButtons from '@/components/likeDislikeButtons';

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
  const { email } = router.query;
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
  const [currentRound, setCurrentRound] = useState(0);
  const petsPerRound = 10;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const petsRes = await fetch(`${apiUrl}/RecEng/getSampleDefault`, {
          headers: { 'Authorization': `Bearer ${token}` }, // Use the token for authorization
        });

        if (!petsRes.ok) throw new Error('Failed to fetch pet data');

        const petsData = await petsRes.json();
        const formattedPets = petsData.map(pet => ({
          ...pet,
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
        }));

        setAllPets(formattedPets.map(pet => pet.imageUrl));
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

  // Calculate the pets to display for the current round
  const startIndex = currentRound * petsPerRound;
  const pets = allPets.slice(startIndex, startIndex + petsPerRound);
  const petDetails = allPetDetails.slice(startIndex, startIndex + petsPerRound);

  // Function to fetch user data (including profile picture)
  const fetchUserData = async (email) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const response = await fetch(`${apiUrl}/users/email/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
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

  // Handle like or dislike button
  const handleYes = () => {
    setIsLiked(true);
    setAnimationDirection('left');
    setSnackbarOpen(true);

    setTimeout(() => {
      handleNextPet();
    }, 500);
  }
  const handleNo = () => {
    setIsLiked(false);
    setAnimationDirection('right');
    setSnackbarOpen(true);

    setTimeout(() => {
      handleNextPet();
    }, 500);
  }

  const handleAdopt = () => {
    setShowBackdrop(true)
    setTimeout(() => {
      setShowBackdrop(false);
    }, 1000);
  };

  const handleNextPet = () => {
    setAnimationDirection(null);
    setCurrentIndex((prevIdx) => (prevIdx + 1) % pets.length);
  }

  const handleNextRound = () => {
    // Increment the round, looping back to 0 if at the end
    setCurrentRound((prevRound) => (prevRound + 1) % (allPets.length / petsPerRound));
  };

  const currentPetDetail = petDetails[currentIndex % petsPerRound] || {};
  const progressValue = ((currentIndex % petsPerRound) + 1) * (100 / petsPerRound);

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
          <LinearProgress variant="determinate" value={progressValue} sx={{ marginBottom: 2 }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', padding : 1 }}>
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
              height="500" width="400" 
              src={pets[currentIndex % petsPerRound]}  // Replace with real image URL
              sx={{ objectFit: 'cover' }} 
            />
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <LikeDislikeButtons handleLike={handleYes} handleDislike={handleNo} handleAdopt={handleAdopt}/>
            </CardActions>

            <Box sx={{ padding: 3}}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                {currentPetDetail.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Breed:</strong> {currentPetDetail.breed}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Type:</strong> {currentPetDetail.type}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Weight:</strong> {currentPetDetail.weight}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Age:</strong> {currentPetDetail.age}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Temperament:</strong> {currentPetDetail.temperament}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Health Status:</strong> {currentPetDetail.healthStatus}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Adoption Center:</strong> {currentPetDetail.adoptionCenter}
              </Typography>
            </Box>
          </Card>
        </Box>

        <Button onClick={handleNextRound}>Next Round</Button>

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