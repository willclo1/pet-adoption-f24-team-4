import React, { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  CardActions
} from '@mui/material';
import { useRouter } from 'next/router';

export default function CustomerHomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [tempProfilePicture, setTempProfilePicture] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { email } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example dog data: names, image URLs, and descriptions
  const dogs = [
    {
      name: 'Bella',
      image: 'https://placekitten.com/400/300',
      description: 'A friendly and energetic dog who loves to play in the park.'
    },
    {
      name: 'Charlie',
      image: 'https://placekitten.com/401/300',
      description: 'Loyal and affectionate, Charlie is looking for his forever home.'
    },
    {
      name: 'Max',
      image: 'https://placekitten.com/402/300',
      description: 'Max is a calm and gentle dog, perfect for a quiet household.'
    },
    {
      name: 'Lucy',
      image: 'https://placekitten.com/403/300',
      description: 'Lucy is adventurous and loves long walks in the mountains.'
    }
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1 >= dogs.length ? 0 : prevSlide + 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 < 0 ? dogs.length - 1 : prevSlide - 1));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTempProfilePicture(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempProfilePicture(imageUrl);
    }
  };

  const handleSave = () => {
    setProfilePicture(tempProfilePicture);
    handleCloseDialog();
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        try {
          const response = await fetch(`http://localhost:8080/users/email/${email}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setUser(data);
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>
          <Button color="inherit">Edit Preferences</Button>
          <Button color="inherit">Adopt a Pet</Button>
          <Avatar
            alt={user.firstName}
            src={profilePicture}
            sx={{ marginLeft: 2, width: 56, height: 56 }}
            onClick={handleClick}
          />
        </Toolbar>
      </AppBar>

      <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
        <Typography variant="h3">Welcome, {user.firstName}</Typography>
        <Typography variant="body1" color="text.secondary">
          Check out the home page!
        </Typography>
      </Stack>

      {/* Slider Section */}
      <div className="slider-container">
        <Button onClick={handlePrevSlide}>Previous</Button>
        <div className="slider">
          <Card
            sx={{
              width: 400,
              height: 450,
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            <CardMedia
              component="img"
              height="250"
              image={dogs[currentSlide].image}
              alt={dogs[currentSlide].name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {dogs[currentSlide].name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {dogs[currentSlide].description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </div>
        <Button onClick={handleNextSlide}>Next</Button>
      </div>

      {/* Styles for Slider */}
      <style jsx>{`
        .slider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
        }

        .slider {
          display: flex;
          overflow: hidden;
          width: 450px; /* Width of the slider */
          position: relative;
        }
      `}</style>

      {/* Menu and Dialog */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCloseMenu}>Login Information</MenuItem>
        <MenuItem onClick={handleOpenDialog}>Edit Personal Information</MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Personal Information</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={user.firstName}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={user.lastName}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
          />
          <Stack marginTop={2}>
            <Typography variant="body1">Profile Picture</Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="profile-picture-upload">
              <Button variant="contained" component="span">
                Upload Profile Picture
              </Button>
            </label>
            {tempProfilePicture && (
              <Avatar
                alt="Profile Picture Preview"
                src={tempProfilePicture}
                sx={{ width: 56, height: 56, marginTop: 1 }}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar to notify user of success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message="Personal information updated successfully"
        />
    </main>
  );
}
