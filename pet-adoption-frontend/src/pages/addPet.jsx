import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete, Box, MenuItem, Grid, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/router';

const AddPet = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { adoptionID, email } = router.query;
    const [petData, setPetData] = useState({
        name: '',
        species: '',
        weight: '',
        coatLength: '',
        furType: '',
        furColor: [],
        dogBreed: [],
        catBreed: [],
        petSize: '',
        age: '',
        temperament: [],
        healthStatus: '',
        sex: '',
        spayedNeutered: '',
        adoptionId: null,
    });

    const [options, setOptions] = useState({
        species: [],
        coatLength: [],
        furType: [],
        furColor: [],
        dogBreed: [],
        catBreed: [],
        size: [],
        temperament: [],
        healthStatus: [],
        sex: [],
        spayedNeutered: [],
    });

    // Fetch the enum options from the backend
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${apiUrl}/getOptions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => setOptions(data))
            .catch(error => console.error('Error fetching options:', error));
    }, []);

    useEffect(() => {
        if (adoptionID) {
            setPetData(prevData => ({ ...prevData, adoptionId: adoptionID }));
        }
    }, [adoptionID]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData(prevData => ({ ...prevData, [name]: value }));
    };

    // Handle array inputs (for tags like dogBreed, catBreed, and temperament)
    const handleArrayChange = (name, value) => {
        setPetData(prevData => ({ ...prevData, [name]: value }));
    };

    // Handle species change (show breeds based on species)
    const handleSpeciesChange = (e) => {
        const { value } = e.target;
        setPetData(prevData => ({
            ...prevData,
            species: value,
            dogBreed: [], // Reset dog breed when species changes
            catBreed: [], // Reset cat breed when species changes
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        fetch(`${apiUrl}/addPet`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(petData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Pet added:', data);
                // Clear the form or add any success feedback here
            })
            .catch(error => console.error('Error adding pet:', error));
    };
    const handleBack = () => {
      router.push(`/adoptionHome?email=${email}`)
    };

    return (
        <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom align="center">
                Add a New Pet
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            name="name"
                            value={petData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Weight"
                            name="weight"
                            value={petData.weight}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Age"
                            name="age"
                            value={petData.age}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Species"
                            name="species"
                            value={petData.species}
                            onChange={handleSpeciesChange}
                            fullWidth
                            required
                        >
                            {options.species.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Coat Length"
                            name="coatLength"
                            value={petData.coatLength}
                            onChange={handleChange}
                            fullWidth
                        >
                            {options.coatLength.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Fur Type"
                            name="furType"
                            value={petData.furType}
                            onChange={handleChange}
                            fullWidth
                        >
                            {options.furType.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Conditionally render Dog Breed or Cat Breed based on species */}
                    {petData.species === 'Dog' && (
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={options.dogBreed}
                                getOptionLabel={(option) => option}
                                onChange={(e, newValue) => handleArrayChange('dogBreed', newValue)}
                                renderInput={(params) => <TextField {...params} label="Dog Breed" fullWidth />}
                            />
                        </Grid>
                    )}
                    {petData.species === 'Cat' && (
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={options.catBreed}
                                getOptionLabel={(option) => option}
                                onChange={(e, newValue) => handleArrayChange('catBreed', newValue)}
                                renderInput={(params) => <TextField {...params} label="Cat Breed" fullWidth />}
                            />
                        </Grid>
                    )}

                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Pet Size"
                            name="petSize"
                            value={petData.petSize}
                            onChange={handleChange}
                            fullWidth
                        >
                            {options.size.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <Autocomplete
                            multiple
                            options={options.temperament}
                            getOptionLabel={(option) => option}
                            onChange={(e, newValue) => handleArrayChange('temperament', newValue)}
                            renderInput={(params) => <TextField {...params} label="Temperament" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Health Status"
                            name="healthStatus"
                            value={petData.healthStatus}
                            onChange={handleChange}
                            fullWidth
                        >
                            {options.healthStatus.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            multiple
                            options={options.furColor}
                            getOptionLabel={(option) => option}
                            onChange={(e, newValue) => handleArrayChange('furColor', newValue)}
                            renderInput={(params) => <TextField {...params} label="Fur Color" fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Sex"
                            name="sex"
                            value={petData.sex}
                            onChange={handleChange}
                            fullWidth
                        >
                            {options.sex.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Spayed/Neutered"
                            name="spayedNeutered"
                            value={petData.spayedNeutered}
                            onChange={handleChange}
                            fullWidth
                        >
                            {options.spayedNeutered.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'center', marginTop: 2 }}>
                    Add Pet
                </Button>
            </Box>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleBack}>
              Back
            </Button>
        </Paper>
    );
};

export default AddPet;