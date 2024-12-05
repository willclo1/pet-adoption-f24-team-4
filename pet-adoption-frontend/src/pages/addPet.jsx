import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete, Box, Chip, MenuItem, Grid, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/router';

const AddPet = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { adoptionID, email } = router.query;
  const [pet, setPet] = useState({
    name: '',
    adoptionID: null,
    attributes: []
  });
  const [attributeOptions, setAttributeOptions] = useState({});
  const [error, setError] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const attributeLabels = {
    Species: "Species",
    "Cat Breed": "Cat Breed",
    "Dog Breed": "Dog Breed",
    "Fur Type": "Fur Type",
    "Fur Color": "Fur Color",
    "Fur Length": "Fur Length",
    Size: "Size",
    Health: "Health Status",
    Gender: "Gender",
    "Spayed / Neutered": "Spayed/Neutered",
    Temperament: "Temperament",
    Age: "Age",           // VERIFY THIS WORKS
    Weight: "Weight (lb)" // VERIFY THIS WORKS
  };

  const chipAttributes = ["Dog Breed", "Cat Breed", "Fur Color", "Temperament"];

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/loadAttributes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to load attributes');
        const data = await response.json();
        console.log('Fetched attribute data:', data);

        const mappedOptions = Object.keys(attributeLabels).reduce((acc, label, index) => {
          acc[label] = data[index] || [];
          return acc;
        }, {});

        console.log('Mapped attributeOptions:', mappedOptions);
        setAttributeOptions(mappedOptions);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load attribute options');
      }
    };

    fetchAttributes();
  }, [apiUrl]);

  useEffect(() => {
    if (adoptionID) {
      setPet((prev) => ({
        ...prev,
        adoptionID: adoptionID
      }))
    }
  }, [adoptionID]);

  const handleFieldChange = (key, value) => {
    setPet((prev) => {
      const updatedAttributes = prev.attributes.filter(
        (attr) => !attr.startsWith(`${key}`)
      );

      if (Array.isArray(value)) {
        value.forEach((v) => updatedAttributes.push(`${key}:${v}`));
      } else {
        updatedAttributes.push(`${key}:${value}`);
      }
      return { ...prev, attributes: updatedAttributes };
    });

    setErrorMessages((prev) => ({ ...prev, [key]: false}));
  };

  const validateFields = () => {
    const errors = {};
    const fields = ['Cat Breed', 'Dog Breed', 'Fur Color', 'Temperament'];

    fields.forEach(
      (key) => {
        if (key === 'Cat Breed' && getSelectedSpecies() !== 'Cat') return;
        if (key === 'Dog Breed' && getSelectedSpecies() !== 'Dog') return;

        const value = pet.attributes.some((attr) => attr.startsWith(`${key}:`));
        if (!value) {
          errors[key] = `${attributeLabels[key]} must have at least one value.`
        }
      }
    );

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${apiUrl}/addPet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pet),
      });

      if (!response.ok) {
        throw new Error('Failed to add pet');
      }
      const data = await response.json();
      console.log('Pet added: ', data);
      setPet({
        name: '',
        adoptionID: null,
        attributes: []
      });
      setErrorMessages({});
      setGeneralError(null);
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setGeneralError(err.message);
    }
  };

  const getSelectedSpecies = () => {
    return (
      pet?.attributes.find((attr) => attr.startsWith('Species:'))?.split(':')[1] || ''
    );
  };

  const handleBack = () => {
    router.push(`/adoptionHome?email=${email}`);
  };

  if (!attributeOptions || Object.keys(attributeOptions).length === 0) {
    return <Typography>Loading attribute options...</Typography>;
  }

  return (
    <main>
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
                value={pet.name}
                onChange={(e) => setPet((prev) => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            {Object.entries(attributeLabels).map(([key, label]) => {
              const species = getSelectedSpecies();
              if (
                (key === 'Dog Breed' && species !== 'Dog') ||
                (key === 'Cat Breed' && species !== 'Cat')
              ) {
                return null; // Skip irrelevant breed fields
              }

              return (
                <Grid item xs={12} key={key}>
                  {attributeOptions[key] && attributeOptions[key].length > 0 ? (
                    chipAttributes.includes(key) ? (
                      <div>
                        <Autocomplete
                          multiple
                          options={attributeOptions?.[key] || []}
                          value={pet.attributes
                            .filter((attr) => attr.startsWith(`${key}:`))
                            .map((attr) => attr.split(':')[1])}
                          onChange={(e, newValue) => handleFieldChange(key, newValue)}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip key={option} label={option} {...getTagProps({ index })} />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label={label} 
                              fullWidth
                              error={!!errorMessages[key]}
                              helperText={errorMessages[key] || ''}
                            />
                          )}
                        />
                        {error && <Typography color="error" sx={{ marginTop: 1 }}>{error}</Typography>}
                      </div>
                    ) : (
                      <TextField
                        select
                        label={label}
                        value={
                          pet.attributes
                            .find((attr) => attr.startsWith(`${key}:`))?.split(':')[1] || ''
                        }
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        fullWidth
                        required
                      >
                        {attributeOptions?.[key]?.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )
                  ) : (
                    // Age and Weight
                    <TextField
                      label={label}
                      value={
                        pet.attributes.find((attr) => attr.startsWith(`${key}:`))?.split(':')[1] || ''
                      }
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      type={key === 'Weight' || key === 'Age' ? 'number' : 'text'}
                      fullWidth
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
          {generalError && <Typography color="error" sx={{ marginTop: 1 }} textAlign={"center"}>{generalError}</Typography>}
          {submitSuccess && <Typography color="green" sx={{ marginTop: 1 }} textAlign={"center"} >Successfully saved pet!</Typography>}
          <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'center', marginTop: 2 }}>
            Add Pet
          </Button>
        </Box>
        <Button variant="outlined" sx={{ marginTop: 2 }} onClick={handleBack}>
          Back
        </Button>
      </Paper>
    </main>
  );
};

export default AddPet;