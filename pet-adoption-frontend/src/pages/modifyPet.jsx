import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    CircularProgress,
    Paper,
    Alert,
    MenuItem,
    Autocomplete,
    Chip,
} from '@mui/material';
import { useRouter } from 'next/router';

const ModifyPet = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { adoptionID, email } = router.query;

    const [pets, setPets] = useState([]);
    const [attributeOptions, setAttributeOptions] = useState({});
    const [selectedPet, setSelectedPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false); // For delete confirmation
    const [petToDelete, setPetToDelete] = useState(null); // Pet pending deletion
    const [petPicture, setPetPicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const attributeLabels = {
        "Species": "Species",
        "Cat Breed": "Cat Breed",
        "Dog Breed": "Dog Breed",
        "Fur Type": "Fur Type",
        "Fur Color": "Fur Color",
        "Fur Length": "Fur Length",
        "Size": "Size",
        "Health": "Health Status",
        "Gender": "Gender",
        "Spayed / Neutered": "Spayed/Neutered",
        "Temperament": "Temperament",
    };

    const chipAttributes = ["Dog Breed", "Cat Breed", "Fur Color", "Temperament"];

    const fetchPets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/pets/${adoptionID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch pets');
            const petsData = await response.json();
            setPets(petsData);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to fetch pets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/loadAttributes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to load attributes');
                const data = await response.json();

                const mappedOptions = Object.keys(attributeLabels).reduce((acc, label, index) => {
                    acc[label] = data[index] || [];
                    return acc;
                }, {});

                setAttributeOptions(mappedOptions);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load attribute options');
            }
        };

        fetchAttributes();
        fetchPets();
    }, [adoptionID, apiUrl]);

    const handleDialogOpen = (pet) => {
        setSelectedPet(pet);
        setPreviewUrl(
            pet.profilePicture ? `data:image/png;base64,${pet.profilePicture.imageData}` : null
        );
        setOpenDialog(true);
    };

    const handleFieldChange = (key, value) => {
        setSelectedPet((prev) => {
            const updatedAttributes = prev.attributes.filter((attr) => !attr.startsWith(`${key}:`));
            if (Array.isArray(value)) {
                value.forEach((v) => updatedAttributes.push(`${key}:${v}`));
            } else {
                updatedAttributes.push(`${key}:${value}`);
            }
            return { ...prev, attributes: updatedAttributes };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPetPicture(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const handleUploadImage = async (petId) => {
        const formData = new FormData();
        formData.append('image', petPicture);
        const token = localStorage.getItem('token');
        await fetch(`${apiUrl}/pet/pet-image/${petId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
    };

    const handleUpdatePet = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${apiUrl}/updatePet`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedPet),
            });
            await fetchPets(); // Refetch pets after updating
        } catch (err) {
            console.error('Failed to update pet', err);
        } finally {
            setOpenDialog(false);
        }
    };

    const handleDeletePet = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${apiUrl}/deletePet`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: petToDelete }),
            });
            await fetchPets(); // Refetch pets after deletion
        } catch (err) {
            console.error('Failed to delete pet', err);
        } finally {
            setDeleteDialog(false);
            setPetToDelete(null);
        }
    };

    const openDeleteConfirmation = (petId) => {
        setPetToDelete(petId);
        setDeleteDialog(true);
    };

    const getSelectedSpecies = () => {
        return (
            selectedPet?.attributes.find((attr) => attr.startsWith('Species:'))?.split(':')[1] || ''
        );
    };

    const handleBack = () => {
        router.push(`/adoptionHome?email=${email}`);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ padding: 3 }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
                sx={{ marginBottom: 2 }}
            >
                Back
            </Button>
            <Typography variant="h4" align="center" gutterBottom>
                Modify Pets
            </Typography>
            <Paper sx={{ padding: 2 }}>
                {pets.map((pet) => (
                    <Box key={pet.id} sx={{ borderBottom: '1px solid #ddd', marginBottom: 2, paddingBottom: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <Avatar
                                    src={
                                        pet.profilePicture
                                            ? `data:image/png;base64,${pet.profilePicture.imageData}`
                                            : '/placeholder.png'
                                    }
                                    alt={pet.name}
                                    sx={{ width: 100, height: 100, margin: 'auto' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {pet.name}
                                </Typography>
                                <Box>
                                    {Object.entries(
                                        pet.attributes.reduce((acc, attr) => {
                                            const [key, value] = attr.split(':');
                                            acc[key] = acc[key] ? [...acc[key], value] : [value];
                                            return acc;
                                        }, {})
                                    ).map(([key, values]) => (
                                        <Typography key={key} variant="body2" sx={{ marginBottom: 0.5 }}>
                                            <strong>{attributeLabels[key] || key}:</strong> {values.join(', ')}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'right', marginTop: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginRight: 1 }}
                                onClick={() => handleDialogOpen(pet)}
                            >
                                Modify
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => openDeleteConfirmation(pet.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Paper>

            {/* Modify Dialog */}
            {openDialog && (
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Modify Pet</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                {previewUrl && (
                                    <Avatar
                                        src={previewUrl}
                                        alt="Pet Picture"
                                        sx={{ width: 120, height: 120, margin: 'auto' }}
                                    />
                                )}
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
                                        {chipAttributes.includes(key) ? (
                                            <Autocomplete
                                                multiple
                                                options={attributeOptions[key]}
                                                value={selectedPet.attributes
                                                    .filter((attr) => attr.startsWith(`${key}:`))
                                                    .map((attr) => attr.split(':')[1])}
                                                onChange={(e, newValue) => handleFieldChange(key, newValue)}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip key={option} label={option} {...getTagProps({ index })} />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField {...params} label={label} fullWidth />
                                                )}
                                            />
                                        ) : (
                                            <TextField
                                                select
                                                label={label}
                                                value={
                                                    selectedPet.attributes
                                                        .find((attr) => attr.startsWith(`${key}:`))
                                                        ?.split(':')[1] || ''
                                                }
                                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                                fullWidth
                                            >
                                                {attributeOptions[key]?.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    </Grid>
                                );
                            })}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                    Upload Pet Picture
                                </Typography>
                                <label htmlFor="upload-image">
                                    <input
                                        accept="image/*"
                                        id="upload-image"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        variant="contained"
                                        component="span"
                                        sx={{
                                            textTransform: 'none',
                                            backgroundColor: '#007BFF',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#0056b3',
                                            },
                                            marginBottom: 2,
                                        }}
                                    >
                                        Select Image
                                    </Button>
                                </label>
                                {petPicture && (
                                    <Typography variant="body2" sx={{ color: 'green', marginTop: 1 }}>
                                        {petPicture.name} selected
                                    </Typography>
                                )}
                                <Button
                                    onClick={() => handleUploadImage(selectedPet.id)}
                                    variant="contained"
                                    sx={{
                                        marginTop: 2,
                                        backgroundColor: '#28a745',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#218838',
                                        },
                                    }}
                                >
                                    Upload Image
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleUpdatePet}>Save Changes</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteDialog && (
                <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this pet? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDeletePet}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default ModifyPet;