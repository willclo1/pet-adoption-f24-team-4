import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, Dialog, DialogContent, DialogTitle, Chip, Box, Slider, Typography } from '@mui/material';
import BackButton from '@/components/backButton';

const EditPreferences = () => {
    const router = useRouter();
    const { userID, email } = router.query;
    const [open, setOpen] = useState(true);

    const [preferences, setPreferences] = useState({
        furColor: {},
        petType: {},
        breed: {},
        petSize: {},
        age: 0, // Adjusted for age as a single value
        temperament: {},
        healthStatus: {},
    });

    const [preferenceOptions, setPreferenceOptions] = useState({});
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Helper function to make fetch requests with auth headers
    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    };

    // Fetch the options for the preference categories
    const fetchOptions = async () => {
        try {
            const response = await fetchWithAuth(`${apiUrl}/getOptions`);
            if (!response.ok) throw new Error('Failed to fetch options');
            const options = await response.json();
            setPreferenceOptions(options);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const togglePreference = (category, option) => {
        setPreferences((prev) => ({
            ...prev,
            [category]: {
                ...(prev[category] || {}),
                [option]: prev[category]?.[option] === 0.5 ? 0 : 0.5,
            },
        }));
    };

    const handleAgeChange = (event, newValue) => {
        setPreferences((prev) => ({
            ...prev,
            age: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const structuredPreferences = Object.keys(preferenceOptions).reduce((acc, category) => {
            acc[category] = {};
            preferenceOptions[category].forEach(option => {
                const enumOption = option.replace(/\s+/g, '_').toUpperCase();
                acc[category][enumOption] = preferences[category]?.[option] === 0.5 ? 0.5 : 0;
            });
            return acc;
        }, {});

        // Set the selected age to have a rating of 0.5
        structuredPreferences.age = { [preferences.age]: 0.5 };

        try {
            const response = await fetchWithAuth(`${apiUrl}/users/${userID}/preferences`, {
                method: 'PUT', // Use POST instead of PUT to add new preferences
                body: JSON.stringify(structuredPreferences),
            });
            if (response.ok) alert('Preferences added successfully!');
            else throw new Error('Failed to add preferences');
        } catch (error) {
            console.error('Error adding preferences:', error);
            alert('Failed to add preferences.');
        }
    };

    const handleBack = () => {
        router.push(`/customer-home?email=${email}`);
    };

    const handleClose = () => {
        setOpen(false);
        router.push(`/recommendationEngine?email=${email}`);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Edit Preferences
                <BackButton defaultPath='/customer-home' />
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {Object.keys(preferenceOptions).map((category) => (
                            <Grid item xs={12} key={category}>
                                <Box mb={1}>{category.charAt(0).toUpperCase() + category.slice(1)}</Box>
                                <Box display="flex" flexWrap="wrap">
                                    {preferenceOptions[category].map((option) => (
                                        <Chip
                                            key={option}
                                            label={option}
                                            onClick={() => togglePreference(category, option)}
                                            color={preferences[category]?.[option] === 0.5 ? 'primary' : 'default'}
                                            sx={{ m: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        ))}
                        {/* Add slider for Age preference */}
                        <Grid item xs={12}>
                            <Typography gutterBottom>Preferred Age</Typography>
                            <Slider
                                value={preferences.age}
                                onChange={handleAgeChange}
                                aria-labelledby="age-slider"
                                min={0}
                                max={20} // Set the max to a reasonable age limit for pets
                                step={1}
                                valueLabelDisplay="auto"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Add Preferences
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditPreferences;