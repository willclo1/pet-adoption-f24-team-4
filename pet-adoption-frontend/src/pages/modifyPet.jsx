import React, { useEffect, useState } from 'react';
import { Button, Divider, Paper, Box, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { Router, useRouter } from 'next/router';

export default function modifyPet() {
        const router = useRouter();
        const [pets, setPets] = useState([]); 
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const {adoptionID, email} = router.query;

        useEffect(()=> {
        const fetchPets = async() => {
            try{
                const response = await fetch(`http://localhost:8080/pets/${adoptionID}`);
                if(!response.ok){
                    throw new Error("Failed to fetch Pets")
                }
                const data = await response.json();
                setPets(data);
            }
            catch (error) {
                console.error("Error fetching Pets:", error);
                setError("Failed to load Pets.");
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);
     if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  const handleBack = () => {
    router.push(`/adoptionHome?email=${email}`);
  };

 return (
  <Box sx={{ marginTop: 4, paddingX: 4 }}>
    <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#1976d2' }}>
      Modify Pets
    </Typography>
    <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: 3 }}>
      <List>
        {pets.length > 0 ? (
          pets.map((pet) => (
            <React.Fragment key={pet.id}>
              <ListItem sx={{ padding: 2 }}>
                <ListItemText
                  primary={`${pet.firstName} ${pet.lastName}`}
                  secondary={`Type: ${pet.petType}, Weight: ${pet.weight} lbs, Fur Type: ${pet.furType}`}
                  primaryTypographyProps={{ variant: 'h6', color: '#333' }}
                  secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography sx={{ padding: 2, color: 'textSecondary' }}>No pets found for this adoption center.</Typography>
        )}
      </List>
    </Paper>
     <Box sx={{ marginTop: 4 }}>
      <Button 
        variant="contained" 
        sx={{ backgroundColor: '#1976d2' }} 
        onClick={handleBack} // Assuming you have the logic for handleBack
      >
        Back
      </Button>
    </Box>
  </Box>
);

}
