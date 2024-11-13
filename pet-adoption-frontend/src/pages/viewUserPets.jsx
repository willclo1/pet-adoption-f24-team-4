import React, { useState, useEffect } from 'react';
import {
    Button, Box, Typography, Paper, CircularProgress, Avatar
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

    useEffect(() => {
        const fetchLikedPets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/likedPets/getPets`, {
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({
                        userId: Number(userID),
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch liked pets');
                }
                const data = await response.json();
                setLikedPets(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        
    }, [apiUrl]);

    const handleBack = () => {
        router.push(`/customer-home?email=${email}&userID=${userID}`);
    };

    //if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <main>
            <NavBar/>
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
                            <Box key={pet.id} sx={{ marginBottom: 2, borderBottom: '1px solid #ddd', paddingBottom: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                            Species: {pet.species}, Age: {pet.age}, Weight: {pet.weight} lbs, Size: {pet.petSize}
                                        </Typography>
                                    </Box>
                                </Box>
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
