import React, { useEffect, useState } from 'react';
import { Stack, Typography, Button, Box, Card, CardMedia, CardActions, Drawer, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import LikeDislikeButtons from '@/components/likeDislikeButtons';

export default function RecommendationEnginePage() {
  //const [state, setState] = useState({ left: false });
  const router = useRouter();
  const { email } = router.query;
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  //const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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
  const petDetails = [
    { name: 'Cat 1', breed: 'Siamese', type: 'Cat', weight: '4kg', age: '2 years', temperament: 'Calm', healthStatus: 'Healthy', adoptionCenter: 'Center A' },
    { name: 'Cat 2', breed: 'Maine Coon', type: 'Cat', weight: '6kg', age: '3 years', temperament: 'Playful', healthStatus: 'Healthy', adoptionCenter: 'Center B' },
    { name: 'Dog 1', breed: 'Labrador', type: 'Dog', weight: '25kg', age: '5 years', temperament: 'Friendly', healthStatus: 'Healthy', adoptionCenter: 'Center C' },
  ]; 
  const currentPet = pets[currentIndex]
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (router.isReady) {
      if (email) {
        setUserEmail(email);
        fetchUserData(email);
      }
    }
  }, [router.isReady, router.query]);

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

  // Function to handle avatar click for menu
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Open dialog for editing personal information
  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  // Close dialog for editing personal information
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProfilePictureFile(null);
  };

  // Handle file upload for profile picture
  const handlePfFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file);
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }

  const handleLogout = () => {
    localStorage.setItem('validUser',JSON.stringify(null));
    router.push(`/`);
  };

  // Save the profile picture to the backend
  const handleSave = async () => {
    if (profilePictureFile) {
      const formData = new FormData();
      formData.append('image', profilePictureFile);
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${apiUrl}/user/profile-image/${userEmail}`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to upload image');
        const updatedUser = await response.json();
        setProfilePicture(`data:image/png;base64,${updatedUser.profilePicture.imageData}`);
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
    handleCloseDialog();
  };

  const handleNavigation = (path) => {
    router.push(`${path}?email=${email}&userID=${user.id}`);
    handleCloseMenu();
  };  

  // Handle like or dislike button
  const handleYes = () => {
    setIsLiked(true);
    setSnackbarOpen(true);
    //handleNextPet();

    setTimeout(() => {
      //setIsLiked(null);
      handleNextPet();
    }, 1000);
  }
  const handleNo = () => {
    setIsLiked(false);
    setSnackbarOpen(true);
    //handleNextPet();

    setTimeout(() => {
      //setIsLiked(null);
      handleNextPet();
    }, 1000);
  }

  const handleNextPet = () => {
    setCurrentIndex((prevIdx) => (prevIdx + 1) % pets.length);
  }

  // const handlePreviousPet = () => {
  //   setCurrentIndex((prevIdx) => (prevIdx - 1 + pets.length) % pets.length);
  // }

  const currentPetDetail = petDetails[currentIndex] || {};

  return (
    <main>
      <NavBar />

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
              {/* <Button size="large" color="primary" onClick={handleYes} startIcon={<CheckCircleIcon sx={{ fontSize: 60 }} />} />
              <Button size="large" color="secondary" onClick={handleNo} startIcon={<CancelIcon sx={{ fontSize: 60 }} />} /> */}
              <LikeDislikeButtons handleLike={handleYes} handleDislike={handleNo}/>
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

        {/* {isLiked !== null && (
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            {isLiked ? "You liked this pet!" : "You disliked this pet."}
          </Typography>
        )} */}

        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          autoHideDuration={2000}
          message={isLiked ? "You liked this pet!" : "You disliked this pet."}
        />
      </Stack>
    </main>
  );
}