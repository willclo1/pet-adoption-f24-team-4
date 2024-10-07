import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, TextField, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

export default function AddPet() {
  const [petType, setPetType] = useState('');
  const router = useRouter();
  const { adoptionID } = router.query;

  const handlePetTypeChange = (event) => {
    setPetType(event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0', // Lighter background
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
          borderRadius: 3, // Rounded corners
          backgroundColor: '#fff',
          padding: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom sx={{ color: '#1976d2' }}>
            Fill in Pet Details
          </Typography>
          <form>
            <TextField
              label="Pet's First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Enter pet's first name"
              required
            />
            <TextField
              label="Pet's Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Enter pet's last name"
              required
            />
            <TextField
              label="Pet's Weight"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Enter pet's weight"
              required
            />
            <TextField
              label="Pet's Fur Color"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Enter pet's fur color"
              required
            />

            {/* Dropdown for pet type */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="pet-type-label">Pet Type</InputLabel>
              <Select
                labelId="pet-type-label"
                id="pet-type"
                value={petType}
                onChange={handlePetTypeChange}
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
                marginTop: 3,
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
        </CardContent>
      </Card>
    </Box>
  );
}