import React, { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Stack, Typography, Button, Box, Card, CardMedia, CardActions, Drawer, Snackbar, Backdrop, LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import LikeDislikeButtons from '@/components/likeDislikeButtons';
import { ApiRounded } from '@mui/icons-material';
import { current } from '@reduxjs/toolkit';

// Keyframes for sliding left and right
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

  // const pets = [
  //   '/petImages/cat1.jpg',
  //   '/petImages/cat2.jpg',
  //   '/petImages/cat3.jpg',
  //   '/petImages/cat4.jpg',
  //   '/petImages/cat5.jpg',
  //   '/petImages/cat6.jpg',
  //   '/petImages/dog1.jpg',
  //   '/petImages/dog2.jpg',
  //   '/petImages/dog3.jpg',
  //   '/petImages/dog4.jpg',
  //   '/petImages/dog5.jpg'
  // ]; 
  // const petDetails = [
  //   { name: 'Cat 1', breed: 'Siamese', type: 'Cat', weight: '4kg', age: '2 years', temperament: 'Calm', healthStatus: 'Healthy', adoptionCenter: 'Center A' },
  //   { name: 'Cat 2', breed: 'Maine Coon', type: 'Cat', weight: '6kg', age: '3 years', temperament: 'Playful', healthStatus: 'Healthy', adoptionCenter: 'Center B' },
  //   { name: 'Dog 1', breed: 'Labrador', type: 'Dog', weight: '25kg', age: '5 years', temperament: 'Friendly', healthStatus: 'Healthy', adoptionCenter: 'Center C' },
  // ]; 
  // const currentPet = pets[currentIndex];

  useEffect(() => {
    if (router.isReady) {
      if (email) {
        setUserEmail(email);
        fetchUserData(email);
      }
    }
  }, [router.isReady, router.query]);

  //get pets data for game
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${apiUrl}/pets`);
        
        if (!response.ok) throw new Error('Failed to fetch pet data');

        const data = await response.json();

        setAllPets(data.map(pet => pet.imageUrl));
        setAllPetDetails(data.map(pet => ({
          name: pet.name,
          breed: pet.breed,
          type: pet.type,
          weight: pet.weight,
          age: pet.age,
          temperament: pet.temperament,
          healthStatus: pet.healthStatus,
          adoptionCenter: pet.adoptionCenter,
        })));

        setLoading(false);
      } catch (error) {
        console.error('Error loading pets...', error);
      }
    };
    fetchPets();
  }, [apiUrl]);

  //find what pets to display given the round
  const startIndex = currentRound * petsPerRound;
  const pets = allPets.slice(startIndex, startIndex+petsPerRound);
  const petDetails = allPetDetails.slice(startIndex, startIndex+petsPerRound);

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
    //handleNextPet();

    setTimeout(() => {
      handleNextPet();
    }, 500);
  }
  const handleNo = () => {
    setIsLiked(false);
    setAnimationDirection('right');
    setSnackbarOpen(true);
    //handleNextPet();

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
    setCurrentRound((prevRound) => (prevRound + 1) % (allPets.length / petsPerRound));
  }

  const currentPetDetail = petDetails[currentIndex] || {};
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
        <Box>
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