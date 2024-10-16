import React, { useEffect, useState } from 'react';
// @mui/material
import { 
  TextField, Button, Paper, Box, Typography,  Grid } from '@mui/material';
import { useRouter } from 'next/router';
import config from './config/config';

export default function ModifyAdoptionCenter() {
  const router = useRouter();
  const { adoptionID, email } = router.query;
  const [adoptionCenter, setAdoptionCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Attempt to retrieve adoption center information
  useEffect(
    () => {
      const fetchAdoptionCenter = async() => {
        if (adoptionID) {
          try {
            const response = await fetch(`http://${config.API_URL}/adoption-centers/${adoptionID}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAdoptionCenter(data);
          } catch (error) {
            console.error('Error fetching adoption center:', error);
            setError('Adoption center not found.');
          } finally {
            setLoading(false);
          }
        }
      }

      fetchAdoptionCenter();
    }, 
    [adoptionID]
  );

  const handleAdoptionCenterEditSubmit = async () => {
    //s.preventDefault();
    try {
      const response = await fetch(`http://${config.API_URL}/adoption-centers/updateAdoptionCenter`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adoptionCenter)
      });

      if (!response.ok) {
        throw new Error("Bad network response");
      }
      //const result = await response.json();
      //setMessage(result.message);

      if (response.status === 200) {
        //router.push(``);
        //setMessage("Edits to adoption center have been saved!")
      }
      else {
        //setMessage("Failed to save edits to adoption center. Please try again.");
      }
    } catch (error) {
      console.error("Error while submitting changes: ", error);
      //setMessage("Failed to save edits to adoption center. Please try again.");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Show the error message if there's an error
  }

  if (!adoptionCenter) {
    return <div>Adoption center not found.</div>
  }

  const handleBack = () => {
    router.push(`/adoptionHome?email=${email}`)
  }

  return (
    <Box sx={{ marginTop: 4, paddingX: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#1976d2' }}>
          Modify Adoption Center Information
        </Typography>
        <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: 3 }}>
          <Grid container direction={"column"} spacing={5}>
            <Grid item>
              <TextField
                //sx={{ padding : 3 }}
                label="Adoption Center Name"
                value={adoptionCenter?.centerName || ''}
                onChange={(e) => setAdoptionCenter({ 
                  ...adoptionCenter, 
                  centerName: e.target.value 
                })}
                fullWidth
                variant="outlined"
                color="primary"  
              />
            </Grid>
            <Grid item>
              <TextField
                //sx={{ padding : 3 }}
                label="Building Address"
                value={adoptionCenter?.buildingAddress || ''}
                onChange={(e) => setAdoptionCenter({ 
                  ...adoptionCenter, 
                  buildingAddress: e.target.value 
                })}
                fullWidth
                variant="outlined"
                color="primary"  
              />
            </Grid>
            <Grid item>
              <TextField
                //sx={{ padding : 3 }}
                label="Description"
                value={adoptionCenter?.description || ''}
                onChange={(e) => setAdoptionCenter({ 
                  ...adoptionCenter, 
                  description: e.target.value 
                })}
                fullWidth
                variant="outlined"
                color="primary"  
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

    <Box sx={{ marginTop: 4 }}>
      <Button 
        variants="outlined"
        color="error"
        onClick={handleBack}
      >
        Back
      </Button>
      <Button
        variant="contained" 
        sx={{ backgroundColor: '#1976d2' }}
        onClick={handleAdoptionCenterEditSubmit}
      >
        Save
      </Button>
    </Box>
  </Box>
  );
}