import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, MenuItem, Button, Grid, Paper, Typography } from '@mui/material';

const EditPreferences = () => {
    const router = useRouter();
    const { userId, email } = router.query;

    const [preferences, setPreferences] = useState({
        furColor: '',
        petType: '',
        breed: '',
        petSize: '',
        age: '',
        temperament: '',
        healthStatus: '',
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Enums for Size and Temperament
    const Size = {
        SMALL: 'SMALL',
        MEDIUM: 'MEDIUM',
        LARGE: 'LARGE',
        EXTRA_LARGE: 'EXTRA_LARGE',
    };

    const Temperament = {
        CHILL: 'CHILL',
        NEEDY: 'NEEDY',
        AGGRESSIVE: 'AGGRESSIVE',
        ENERGETIC: 'ENERGETIC',
    };

    const fetchUserPreferences = async () => {
        try {
            if (!userId) {
                console.warn('User ID is not defined.');
                return; // Early return if userId is not available
            }
            const response = await fetch(`${apiUrl}/${userId}/preferences`);
            if (!response.ok) {
                throw new Error('Failed to fetch user preferences');
            }
            const data = await response.json();
            setPreferences(data);
        } catch (error) {
            console.error('Error fetching user preferences:', error);
        }
    };

    useEffect(() => {
        if (userId) { // Ensure userId is defined before fetching preferences
            fetchUserPreferences();
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreferences((prevPreferences) => ({
            ...prevPreferences,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/users/${userId}/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error('Failed to update preferences');
            }

            alert('Preferences updated successfully!');
        } catch (error) {
            console.error('Error updating preferences:', error);
            alert('Failed to update preferences.');
        }
    };

    const handleBack = () => {
        router.push(`/customer-home?email=${email}`); // Navigate back to home page with email
    };

    return (
        <Paper style={{ padding: '30px', margin: '20px', maxWidth: '600px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Edit Preferences
            </Typography>
            <Button variant="outlined" color="secondary" onClick={handleBack} style={{ marginBottom: '20px' }}>
                Back to Home
            </Button>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Fur Color"
                            name="furColor"
                            value={preferences.furColor}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Pet Type"
                            name="petType"
                            value={preferences.petType}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Breed"
                            name="breed"
                            value={preferences.breed}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Pet Size"
                            name="petSize"
                            value={preferences.petSize}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        >
                            {Object.values(Size).map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="number"
                            label="Age"
                            name="age"
                            value={preferences.age}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Temperament"
                            name="temperament"
                            value={preferences.temperament}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        >
                            {Object.values(Temperament).map((temp) => (
                                <MenuItem key={temp} value={temp}>
                                    {temp}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Health Status"
                            name="healthStatus"
                            value={preferences.healthStatus}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Update Preferences
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default EditPreferences;