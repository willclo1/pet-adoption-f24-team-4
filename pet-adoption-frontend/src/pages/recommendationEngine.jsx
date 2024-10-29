import React, { useEffect, useState } from 'react';
import { Stack, Typography, Button, Box, Card, CardMedia, CardActions, Drawer } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';

export default function RecommendationEnginePage() {
  const router = useRouter();
  const { email } = router.query;
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pets = [
    '/petImages/cat1.jpg',
    '/petImages/cat2.jpg',
    '/petImages/cat3.jpg',
    '/petImages/cat4.jpg',
    '/petImages/cat5.jpg',
    '/petImages/cat6.jpg',
    '/petImages/dog1.jpg',
    '/petImages/dog2.jpg',
    '/petImages/dog3.jpg',
    '/petImages/dog4.jpg',
    '/petImages/dog5.jpg'
  ]; 
  const currentPet = pets[currentIndex]
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const petDetails = {
    name: "Buddy",
    breed: "Golden Retriever",
    type: "Dog",
    weight: "30 kg",
    age: "3 years",
    temperament: "Friendly",
    healthStatus: "Healthy",
    adoptionCenter: "Happy Paws Adoption Center",
  };

  // Fetch user data when page loads
  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        try {
          const response = await fetch(`${apiUrl}/users/email/${email}`);
          if (!response.ok || !(localStorage.getItem('validUser') === `\"${email}\"`)) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setUser(data);
          // Set profile picture if exists
          if (data.profilePicture && data.profilePicture.imageData) {
            setProfilePicture(`data:image/png;base64,${data.profilePicture.imageData}`);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          setError('User not found.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [email]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  // Handle like or dislike button
  const handleYes = () => {
    setIsLiked(true);
    handleNextPet();

    setTimeout(() => {
      setIsLiked(null);
    }, 250);
  }
  const handleNo = () => {
    setIsLiked(false);
    handleNextPet();

    setTimeout(() => {
      setIsLiked(null);
    }, 250);
  }

  const handleNextPet = () => {
    setCurrentIndex((prevIdx) => (prevIdx + 1) % pets.length);
  }

  const handlePreviousPet = () => {
    setCurrentIndex((prevIdx) => (prevIdx - 1 + pets.length) % pets.length);
  }

  return (
    <main>
      <NavBar user={user} profilePicture={profilePicture} email={email} />
      <Stack sx={{ paddingTop: 2 }} alignItems="center" gap={2}>
        <Typography variant="h3">Start Matching!</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', padding : 1 }}>
          <Card sx={{ maxWidth: 600 }}>
            <CardMedia 
            component="img" 
            alt="Pet Image" 
            height="500" width="400" 
            src={pets[currentIndex]}  // Replace with real image URL
            sx={{ objectFit: 'cover' }} />
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <Button size="large" color="primary" onClick={handleYes} startIcon={<CheckCircleIcon sx={{ fontSize: 60 }} />} />
              <Button size="large" color="secondary" onClick={handleNo} startIcon={<CancelIcon sx={{ fontSize: 60 }} />} />
            </CardActions>

            <Box sx={{ padding: 3}}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                {petDetails.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Breed:</strong> {petDetails.breed}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Type:</strong> {petDetails.type}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Weight:</strong> {petDetails.weight}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Age:</strong> {petDetails.age}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Temperament:</strong> {petDetails.temperament}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Health Status:</strong> {petDetails.healthStatus}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Adoption Center:</strong> {petDetails.adoptionCenter}
              </Typography>
            </Box>
          </Card>
        </Box>

        {isLiked !== null && (
          <Typography variant="h5" sx={{ marginTop:  2 }}>
            {isLiked ? "You liked this pet!" : "You disliked this pet."}
          </Typography>
        )}
      </Stack>
    </main>
  );
}