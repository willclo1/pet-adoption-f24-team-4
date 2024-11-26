import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CenterPublicProfile() {
    const router = useRouter();
    const { adoptionID } = router.query;
    const [adoptionCenter, setAdoptionCenter] = useState(null);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currPet, setCurrPet] = useState(null);
    const [error, setError] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleViewPet = (pet) => {
        setCurrPet(pet);
    };

    const handleExit = () => {
        setCurrPet(null);
    };

    // Fetch Adoption Center details
    useEffect(() => {
        const fetchAdoptionCenter = async () => {
            try {
                const response = await fetch(`${apiUrl}/adoption-centers/${adoptionID}`);
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
                const response = await fetch(`${apiUrl}/pets/${adoptionID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Pets');
                }
                const data = await response.json();
                setPets(data);
            } catch (error) {
                console.error('Error fetching Pets:', error);
                setError('Failed to load Pets.');
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

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Address:
                </Typography>
                <Typography variant="body1">{adoptionCenter?.buildingAddress}</Typography>

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    About:
                </Typography>
                <Typography>{adoptionCenter?.description}</Typography>

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
                                <Card sx={{ width: 300, borderRadius: 2, backgroundColor: '#fff', boxShadow: 2 }}>
                                    <Avatar
                                        src={pet.profilePicture?.imageData ? `data:image/png;base64,${pet.profilePicture.imageData}` : null}
                                        sx={{ width: 300, height: 200, objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {pet.name}
                                        </Typography>
                                        <Button onClick={() => handleViewPet(pet)}>View Details</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Card>

            <Dialog open={!!currPet} onClose={handleExit}>
                <DialogTitle>Pet Details</DialogTitle>
                <DialogContent>
                    <Avatar
                        src={currPet?.profilePicture?.imageData ? `data:image/png;base64,${currPet.profilePicture.imageData}` : null}
                        sx={{ width: 300, height: 200, objectFit: 'cover' }}
                    />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        {currPet?.name}
                    </Typography>

                    <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                        Attributes:
                    </Typography>
                    {currPet?.attributes?.length > 0 ? (
                        (() => {
                            // Group attributes by key
                            const groupedAttributes = currPet.attributes.reduce((acc, attr) => {
                                const [key, value] = attr.split(':');
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(value);
                                return acc;
                            }, {});

                            // Render grouped attributes
                            return (
                                <ul style={{ paddingLeft: '20px' }}>
                                    {Object.entries(groupedAttributes).map(([key, values]) => (
                                        <li key={key} style={{ marginBottom: '10px' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {key}:
                                            </Typography>
                                            <Typography variant="body2">
                                                {values.join(', ')}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            );
                        })()
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No attributes available.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExit}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}