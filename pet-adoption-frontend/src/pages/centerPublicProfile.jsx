import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Grid, Button, Avatar,Dialog,DialogTitle,DialogContent,DialogActions } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CenterPublicProfile() {
    const router = useRouter();
    const { adoptionID } = router.query;
    const [adoptionCenter, setAdoptionCenter] = useState(null);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currPet,setCurrPet] = useState(null);
    const [error, setError] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    const handleViewPet = (pet) =>{
        setCurrPet(pet);   

    }
    const handleExit = () => {
        setCurrPet(null);


    }
    // Fetch Adoption Center details
    useEffect(() => {
        const fetchAdoptionCenter = async () => {
                try {
                    const response = await fetch(`${apiUrl}/adoption-centers/${adoptionID}`, {
                    });
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
        };
        fetchAdoptionCenter();
    }, [adoptionID, apiUrl]);

    // Fetch Pets for the Adoption Center
    useEffect(() => {
        const fetchPets = async () => {
                try {
                    const response = await fetch(`${apiUrl}/pets/${adoptionID}`, {
                    });
                    if (!response.ok) {
                        throw new Error("Failed to fetch Pets");
                    }
                    const data = await response.json();
                    setPets(data);
                } catch (error) {
                    console.error("Error fetching Pets:", error);
                    setError("Failed to load Pets.");
                } finally {
                    setLoading(false);
                }
        };
        fetchPets();
    }, [adoptionID, apiUrl]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Box sx={{ padding: 4, textAlign: 'center' }}>
                <Alert severity="error">{error}</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    sx={{ marginTop: 2 }}
                    onClick={() => router.push('/')}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f0f4f8' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                sx={{ marginBottom: 2, color: '#1976d2', borderColor: '#1976d2' }}
                onClick={() => router.push('/viewCenters')}
            >
                Back to Home
            </Button>

            <Card sx={{ boxShadow: 3, borderRadius: 4, padding: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {adoptionCenter?.centerName}
                </Typography>

                <Typography variant="h6" component='span' gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    <b>Address:</b>
                </Typography>
                <Typography variant="body1" component='span' gutterBottom>
                    {adoptionCenter?.buildingAddress}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    <b>About:</b>
                </Typography>
                <Typography sx={{ 
                                display: 'inline-block',
                                marginBottom: 3,
                                width: 400,
                                wordBreak: 'break-all'
                                }}>
                    {adoptionCenter?.description}
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Pets Available for Adoption
                </Typography>

                {pets.length === 0 ? (
                    <Typography variant="body1" color="textSecondary">
                        No pets available at this time.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {pets.map((pet) => (
                            <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                <Card sx={{ width: 500,height: 500, borderRadius: 2, backgroundColor: '#fff', boxShadow: 2, padding: 2 }} >
                                <Avatar
                                        src={pet.profilePicture && pet.profilePicture.imageData ? `data:image/png;base64,${pet.profilePicture.imageData}` : null}
                                        sx={{
                                            flex: 1,
                                            width: 450,
                                            height: 350,
                                            resizeMode: 'contain',
                                            borderRadius: '0%', // if you want it circular, use '50%'
                                            objectPosition: 'center'  // Centers the image within the element
                                        }}
                                        style={{border: 0, objectfit: 'fill'}}
                                        
                                        
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                        <Avatar sx={{ marginRight: 2, backgroundColor: '#1976d2' }}>
                                            <PetsIcon />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {pet.name} 
                                        </Typography>
                                    </Box>
                                    <Button className="adopt-button"  onClick={() => handleViewPet(pet)}>View Pet</Button>
                                        
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Card>
            <Dialog open={currPet}>
                <DialogTitle>{"Would You Like To Adopt This Pet?"}</DialogTitle>
                <DialogContent>
                <Avatar
                    src={currPet && currPet.profilePicture && currPet.profilePicture.imageData ? `data:image/png;base64,${currPet.profilePicture.imageData}` : null}
                        sx={{
                            flex: 1,
                            width: 450,
                            height: 350,
                            resizeMode: 'contain',
                            borderRadius: '0%', // if you want it circular, use '50%'
                            objectPosition: 'center'  // Centers the image within the element
                        }}
                        style={{border: 0, objectfit: 'fill'}}
                        
                        
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <Avatar sx={{ marginRight: 2, backgroundColor: '#1976d2' }}>
                            <PetsIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {currPet ? currPet.name : null} 
                        </Typography>
                        
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        Type: {currPet ? currPet.species : null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Age: {currPet ? currPet.age : null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Coat Length: {currPet ? currPet.coatLength : null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Breed: {currPet ? currPet.species == 'CAT' ? currPet.catBreed : currPet.dogBreed : null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Fur Type: {currPet ? currPet.furType: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Health Status: {currPet ? currPet.healthStatus: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Size: {currPet ? currPet.petSize: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Sex: {currPet ? currPet.sex: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         spayed Neutered: {currPet ? currPet.spayedNeutered: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Temperament: {currPet ? currPet.temperament: null}
                    </Typography>
                   

                </DialogContent>
                <DialogActions>
                    <Button className="adopt-button" onClick={handleExit}>No</Button>
                    <Button  className="adopt-button">
                        Adopt
                    </Button>

                </DialogActions>
            </Dialog>
            
            </Box>

        
    );
}