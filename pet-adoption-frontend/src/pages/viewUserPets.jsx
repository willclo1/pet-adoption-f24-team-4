import React, { useState, useEffect } from 'react';
import {
    Button, Box, Typography, Paper, CircularProgress, Avatar, Stack
} from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';

const LikedPets = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { email, userID } = router.query;
    const [likedPets, setLikedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Helper function to parse and group attributes
    const groupAttributes = (attributes) => {
        return attributes.reduce((grouped, attr) => {
            const [type, value] = attr.split(':').map((item) => item.trim());
            if (!grouped[type]) grouped[type] = [];
            grouped[type].push(value);
            return grouped;
        }, {});
    };

    // Fetch liked pets on component mount
    useEffect(() => {
        const fetchLikedPets = async () => {
            try {
                if (!userID) return; // Wait until userID is available

                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/likedPets/getPets/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch liked pets');
                }

                const data = await response.json();

                // Group attributes for each pet
                const formattedPets = data.map((pet) => ({
                    ...pet,
                    groupedAttributes: groupAttributes(pet.attributes),
                }));

                setLikedPets(formattedPets);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedPets();
    }, [apiUrl, userID]);

    // Handle navigation to the customer home page
    const handleBack = () => {
        router.push(`/customer-home?email=${email}&userID=${userID}`);
    };


    const handleAdopt = (pet) => {
        if (pet && pet.center) {
            const adoptionCenterName = encodeURIComponent(pet.center.centerName); // Encode for URL safety
            router.push(`/message?email=${email}&userID=${userID}&centerName=${adoptionCenterName}`);
        }
    };
    // Loading and error handling
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <main>
            <NavBar />
            <Box sx={{ padding: 3 }}>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={handleBack}>
                    Back
                </Button>
                <Typography variant="h4" align="center" gutterBottom>
                    Liked Pets
                </Typography>
                <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                    {likedPets.length > 0 ? (
                        likedPets.map((pet) => (
                            <Box
                                key={pet.id}
                                sx={{
                                    marginBottom: 2,
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                    {pet.profilePicture && (
                                        <Avatar
                                            src={`data:image/png;base64,${pet.profilePicture.imageData}`}
                                            alt="Pet Picture"
                                            sx={{ width: 80, height: 80, marginRight: 2 }}
                                        />
                                    )}
                                    <Box>
                                        <Typography variant="h6">{pet.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Located at: {pet.center?.centerName || 'Unknown Center'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ marginBottom: 1 }}>
                                    <Typography variant="subtitle1">Attributes:</Typography>
                                    <Box sx={{ marginLeft: 2 }}>
                                        {Object.entries(pet.groupedAttributes).map(([key, values], index) => (
                                            <Typography key={index} variant="body2" color="textSecondary">
                                                <strong>{key}:</strong> {values.join(', ')}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAdopt(pet)}
                                    >
                                        Adopt
                                    </Button>
                                </Stack>
                            </Box>
                        ))
                    ) : (
                        <Typography align="center" color="textSecondary">
                            No liked pets found.
                        </Typography>
                    )}
                </Paper>
            </Box>
        </main>
    );
};

export default LikedPets;