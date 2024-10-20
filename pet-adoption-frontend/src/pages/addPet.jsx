import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, TextField, Typography, Button, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



export default function AddPet() {

  const [petType, setPetType] = useState('');
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const[weight, setWeight] = useState('');
  const [furType, setFur] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [breed, setBreed] = useState('');
  const [petSize, setPetSize] = useState(''); // If Size is an enum, you might want to handle it accordingly
  const [age, setAge] = useState('');
  const [temperament, setTemperament] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [petPicture,setPetPicture] = useState('');
  const router = useRouter();
  const { adoptionID, email } = router.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
    const response = await fetch(`${apiUrl}/addPet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                   body: JSON.stringify({firstName, lastName, petType, weight, furType,
                    adoptionID, petSize, temperament, breed, age, healthStatus}),
            });
             if (!response.ok) {
                throw new Error("Bad network response");
            }
            const result = await response.json();
            setMessage("Pet Added!");
            setSuccess(true); 
        } catch (error) {
            console.error("Error Adding Pet: ", error);
            setMessage("Pet failed to be added. Please try again");
            setSuccess(false); 
        }

  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPetPicture(file); // Store the file for uploading later
    }
    handleSave();
  };
  const handleSave = async () => {


    if (petPicture) {
      const formData = new FormData();
      formData.append('image', petPicture);
      
      try {
        const response = await fetch(`${apiUrl}/pets/`, {
          method: 'POST',
          body: formData,
        });
      
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        const reponse = await fetch(`${apiUrl}/users/email/${email}`); // Updated to fetch by email
          

        // Get the updated user data
        const updatedUser = await reponse.json();
        console.log('WEHIWRIF');
        console.log(updatedUser);

        // Update profile picture state
        if (updatedUser.profilePicture && updatedUser.profilePicture.imageData) {
          setProfilePicture(`data:image/png;base64,${updatedUser.profilePicture.imageData}`);
        } else {
          setProfilePicture(null);
        }
        
        setSnackbarOpen(true);
        window.location.reload(); // Reload to refresh user data
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }


  }
  

  const handlePetTypeChange = (event) => {
    setPetType(event.target.value);
  };
   const handleBack = () => {
    router.push(`/adoptionHome?email=${email}`);
  };

 return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: 2,
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: 6, color: '#333', fontWeight: 500 }}>
        Add Your Pet
      </Typography>

      <Card
        sx={{
          width: 420,
          boxShadow: 8,
          borderRadius: 3,
          backgroundColor: '#fff',
          padding: 4,
          maxHeight: '90vh', // Ensure the card doesn't overflow the screen height
          overflow: 'auto',   // Enable scrolling if needed
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom sx={{ color: '#1976d2' }}>
            Fill in Pet Details
          </Typography>

            {/* Display success or error message */}
          {message && (
            <Alert 
              severity={success ? "success" : "error"} 
              sx={{ marginBottom: 2 }}
            >
              {message}
            </Alert>
          )}
        <form onSubmit={handleSubmit}>
            <TextField
              label="Pet's First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="Enter pet's first name"
              required
            />
            
            <TextField
              label="Pet's Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Enter pet's last name"
              required
            />

            <TextField
              label="Pet's Weight"
              variant="outlined"
              fullWidth
              margin="normal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter pet's weight"
              required
            />

            <TextField
              label="Pet's Fur Color"
              variant="outlined"
              fullWidth
              margin="normal"
              value={furType}
              onChange={(e) => setFur(e.target.value)}
              placeholder="Enter pet's fur color"
              required
            />

            <TextField
              label="Pet's Breed"
              variant="outlined"
              fullWidth
              margin="normal"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Enter pet's breed"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="pet-size-label">Pet Size</InputLabel>
              <Select
                labelId="pet-size-label"
                id="pet-size"
                value={petSize}
                onChange={(e) => setPetSize(e.target.value)} // Add function to set pet size
                label="Pet Size"
                required
              >
                <MenuItem value="SMALL">Small</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LARGE">Large</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Pet's Age"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter pet's age"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="pet-temperament-label">Pet Temper</InputLabel>
              <Select
                labelId="pet-temperament-label"
                id="pet-temperament"
                value={temperament}
                onChange={(e) => setTemperament(e.target.value)} // Add function to set pet size
                label="Pet Temperament"
                required
              >
                <MenuItem value="CHILL">Chill</MenuItem>
                <MenuItem value="NEEDY">Needy</MenuItem>
                <MenuItem value="AGGRESSIVE">Aggresive</MenuItem>
                <MenuItem value="ENERGETIC">Energetic</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Pet's Health Status"
              variant="outlined"
              fullWidth
              margin="normal"
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}
              placeholder="Enter pet's health status"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="pet-type-label">Pet Type</InputLabel>
              <Select
                labelId="pet-type-label"
                id="pet-type"
                value={petType}
                onChange={(e) => setPetType(e.target.value)} // Ensure this function is defined
                label="Pet Type"
                required
              >
                <MenuItem value="Cat">Cat</MenuItem>
                <MenuItem value="Dog">Dog</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: 1,
                paddingY: 1.5,
                backgroundImage: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: 'white',
                fontWeight: 'bold',
              }}
              endIcon={<PetsIcon />}
            >
              Add Pet
            </Button>
          </form>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              marginTop: 2,
              paddingY: 1.5,
              color: '#1976d2',
              fontWeight: 'bold',
            }}
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Adoption Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}