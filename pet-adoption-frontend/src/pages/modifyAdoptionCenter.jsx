import React, { useEffect, useState } from 'react';
// @mui/material
import { 
  TextField, Button, Paper, Box, Typography, Grid, Alert 
} from '@mui/material';
import { useRouter } from 'next/router';

export default function ModifyAdoptionCenter() {
  const router = useRouter();
  const { adoptionID, email } = router.query;
  const [adoptionCenter, setAdoptionCenter] = useState(null);
  const [description, setDescription] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [formatError, setFormatError] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Attempt to retrieve adoption center information
  useEffect(() => {
    const fetchAdoptionCenter = async () => {
      if (adoptionID) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${apiUrl}/adoption-centers/${adoptionID}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          setAdoptionCenter(data);
          setDescription(data.description);
          setAddress(data.buildingAddress);
          
        } catch (error) {
          console.error('Error fetching adoption center:', error);
          setError('Adoption center not found.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAdoptionCenter();
  }, [adoptionID]);

  const handleAdoptionCenterEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/adoption-centers/updateAdoptionCenter`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          adoptionID: adoptionCenter?.adoptionID,
          centerName: adoptionCenter?.centerName,
          buildingAddress: adoptionCenter?.buildingAddress,
          description: adoptionCenter?.description
        })
      });

      if (!response.ok) {
        throw new Error("Bad network response");
      }

      if (response.status === 200) {
        setFormatError('');
        setMessage('Successfully changed!');
        setSuccess(true);
      }
    } catch (error) {
      setFormatError('Format Error: Please check address format.');
      setMessage('ERROR: Something went wrong.');
      setSuccess(false);
      console.error("Error while submitting changes: ", error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!adoptionCenter) {
    return <div>Adoption center not found.</div>;
  }

  const handleBack = () => {
    router.push(`/adoptionHome?email=${email}`);
  }

  return (
    <Box sx={{ marginTop: 4, paddingX: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#1976d2' }}>
          Modify Adoption Center Information
        </Typography>
        {message && (
          <Alert 
            severity={success ? "success" : "error"} 
            sx={{ marginBottom: 2 }}
          >
            {message}
          </Alert>
        )}
        <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: 3 }}>
          <Grid container direction={"column"} spacing={5}>
            <Grid item>
              <TextField
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
            <Typography sx={{ marginLeft : 6, fontWeight: 'bold', color: 'red' }}> {formatError} </Typography>
            <Grid item>
              <TextField
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
          variant="outlined"
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