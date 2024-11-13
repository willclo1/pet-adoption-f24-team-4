import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, TextField, Typography, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AddAdoptionHome() {
    const router = useRouter();
    const [adoptionName, setAdoptionName] = useState('');
    const [adoptionAddress, setAdoptionAddress] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const validateFields = () => {
        let errors = {};
        if (adoptionName.trim() === '') {
            errors.adoptionName = 'Center Name is required';
        }
        if (adoptionAddress.trim() === '') {
            errors.adoptionAddress = 'Address is required';
        } else if (!/^[^,]+,\s*[^,]+,\s*[^,]+$/.test(adoptionAddress.trim())) {
            errors.adoptionAddress = 'Address must be in the format: street, city, state';
        }
        if (description.trim() === '') {
            errors.description = 'Description is required';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevents the default form submission behavior
        if (!validateFields()) return;
        
        try {
            const response = await fetch(`${apiUrl}/adoption-centers/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ adoptionName, adoptionAddress, description })
            });

            if (!response.ok) {
                throw new Error("Bad network response");
            }

            if (response.status === 200) {
                setMessage("Center Added!");
                setTimeout(() => {
                    router.push(`/`);
                }, 1000);
            } else {
                setMessage("Center not added");
            }
        } catch (error) {
            console.error("Error while submitting changes: ", error);
            setMessage("An error occurred while adding the center");
        }
    };

    const handleBack = () => {
        router.push(`/`);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0',
                padding: 2,
            }}
        >
            <Typography variant="h2" sx={{ marginBottom: 6, color: '#333', fontWeight: 500 }}>
                Register A New Center
            </Typography>

            <Card
                sx={{
                    width: 420,
                    boxShadow: 8,
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    padding: 4,
                    maxHeight: '90vh',
                    overflow: 'auto',
                }}
            >
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom sx={{ color: '#1976d2' }}>
                        Fill in Adoption Center Details
                    </Typography>

                    {/* Display success or error message */}
                    {message && (
                        <Alert
                            severity={message === "Center Added!" ? "success" : "error"}
                            sx={{ marginBottom: 2 }}
                        >
                            {message}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Center Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={adoptionName}
                            onChange={(e) => setAdoptionName(e.target.value)}
                            placeholder="Enter Center Name"
                            required
                            error={!!errors.adoptionName}
                            helperText={errors.adoptionName}
                        />
                        <TextField
                            label="Address"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={adoptionAddress}
                            onChange={(e) => setAdoptionAddress(e.target.value)}
                            placeholder="Enter Center Address (e.g., street, city, state)"
                            required
                            error={!!errors.adoptionAddress}
                            helperText={errors.adoptionAddress}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Description"
                            required
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                marginTop: 3,
                                paddingY: 1.5,
                                backgroundImage: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                color: 'white',
                                fontWeight: 'bold',
                            }}
                        >
                            Add Center
                        </Button>
                    </form>

                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginTop: 2,
                            paddingY: 1.5,
                            color: '#1976d2',
                            fontWeight: 'bold',
                        }}
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Back to Home
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}