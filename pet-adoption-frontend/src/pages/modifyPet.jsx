import React, { useEffect, useState } from 'react';
import {
    DialogActions,
    TextField,
    DialogContent,
    Dialog,
    DialogTitle,
    ListItemSecondaryAction,
    Button,
    Divider,
    Paper,
    Box,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Select,
    MenuItem
} from '@mui/material';
import { useRouter } from 'next/router';

export default function ModifyPet() {
    const router = useRouter();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { adoptionID, email } = router.query;
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch(`${apiUrl}/pets/${adoptionID}`);
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

    const handleDelete = async (petId) => {
        if (window.confirm("Are you sure you want to delete this pet?")) {
            try {
                const response = await fetch(`${apiUrl}/deletePet`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: petId }),
                });

                if (!response.ok) {
                    throw new Error("Failed to delete the pet");
                }

                setPets((prevPets) => prevPets.filter(pet => pet.id !== petId));
            } catch (error) {
                console.error("Error deleting Pet:", error);
                setError("Failed to delete the pet.");
            }
        }
    };

    const handleModifyPet = async () => {
        if (window.confirm("Are you sure you want to modify this pet?")) {
            try {
                const response = await fetch(`${apiUrl}/updatePet`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selectedPet),
                });

                if (!response.ok) {
                    throw new Error("Failed to modify the pet");
                }

                setPets((prevPets) =>
                    prevPets.map((pet) => (pet.id === selectedPet.id ? { ...pet, ...selectedPet } : pet))
                );
                setOpenDialog(false); // Close dialog after modifying
            } catch (error) {
                console.error("Error modifying Pet:", error);
                setError("Failed to modify the pet.");
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleBack = () => {
        router.push(`/adoptionHome?email=${email}`);
    };

    // Define enums for Size and Temperament
    const sizeOptions = ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'];
    const temperamentOptions = ['CHILL', 'NEEDY', 'AGGRESSIVE', 'ENERGETIC'];

    return (
        <Box sx={{ marginTop: 4, paddingX: 4 }}>
            <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#1976d2' }}>
                Modify Pets
            </Typography>
            <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: 3 }}>
                <List>
                    {pets.length > 0 ? (
                        pets.map((pet) => (
                            <React.Fragment key={pet.id}>
                                <ListItem sx={{ padding: 2 }}>
                                    <ListItemText
                                        primary={`${pet.firstName} ${pet.lastName}`}
                                        secondary={`Type: ${pet.petType}, Weight: ${pet.weight} lbs, Fur Type: ${pet.furType}, Breed: ${pet.breed}, Size: ${capitalizeFirstLetter(pet.petSize)}`}
                                        primaryTypographyProps={{ variant: 'h6', color: '#333' }}
                                        secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="info"
                                        onClick={() => { setSelectedPet(pet); setOpenDialog(true); }}
                                    >
                                        Modify
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(pet.id)}
                                    >
                                        Delete
                                    </Button>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))
                    ) : (
                        <Typography sx={{ padding: 2, color: 'textSecondary' }}>No pets found for this adoption center.</Typography>
                    )}
                </List>
            </Paper>
            <Box sx={{ marginTop: 4 }}>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#1976d2' }}
                    onClick={handleBack}
                >
                    Back
                </Button>
            </Box>

            {/* Dialog for Modifying Pet */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="sm"
                sx={{ overflow: 'visible', padding: 3 }}
            >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#1976d2',
                        paddingY: 1,
                        marginTop: 1,
                        marginBottom: 2
                    }}
                >
                    Modify Pet
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        minHeight: '300px',
                        paddingY: 1
                    }}
                >
                    <TextField
                        label="First Name"
                        value={selectedPet?.firstName || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, firstName: e.target.value })}
                        fullWidth
                        variant="outlined"
                        color="primary"
                    />
                    <TextField
                        label="Last Name"
                        value={selectedPet?.lastName || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, lastName: e.target.value })}
                        fullWidth
                        variant="outlined"
                        color="primary"
                    />
                    <TextField
                        label="Weight (lbs)"
                        value={selectedPet?.weight || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, weight: parseInt(e.target.value) })}
                        fullWidth
                        type="number"
                        variant="outlined"
                        color="primary"
                    />
                    <TextField
                        label="Fur Type"
                        value={selectedPet?.furType || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, furType: e.target.value })}
                        fullWidth
                        variant="outlined"
                        color="primary"
                    />
                    <TextField
                        label="Age"
                        value={selectedPet?.age || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, age: parseInt(e.target.value) })}
                        fullWidth
                        type="number"
                        variant="outlined"
                        color="primary"
                    />
                    <TextField
                        label="Health Status"
                        value={selectedPet?.healthStatus || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, healthStatus: e.target.value })}
                        fullWidth
                        variant="outlined"
                        color="primary"
                    />
                    <TextField
                        label="Temperament"
                        value={selectedPet?.temperament || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, temperament: e.target.value })}
                        fullWidth
                        variant="outlined"
                        select
                        SelectProps={{
                            value: selectedPet?.temperament || '',
                            onChange: (e) => setSelectedPet({ ...selectedPet, temperament: e.target.value }),
                        }}
                    >
                        {temperamentOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Size"
                        value={selectedPet?.size || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, size: e.target.value })}
                        fullWidth
                        variant="outlined"
                        select
                        SelectProps={{
                            value: selectedPet?.size || '',
                            onChange: (e) => setSelectedPet({ ...selectedPet, size: e.target.value }),
                        }}
                    >
                        {sizeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleModifyPet} variant="contained" color="primary">
                        Modify
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}