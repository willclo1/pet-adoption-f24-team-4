import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Stack, Snackbar } from "@mui/material";
import { useRouter } from 'next/router'; 

export default function RegisterPage() {
    const router = useRouter();
    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [emailAddress, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userType, setUserType] = useState('');
    const [selectedCenter, setSelectedCenter] = useState('');
    const [adoptionCenters, setAdoptionCenters] = useState([]); 
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; 

    const handleRegister = () => {
        router.push('/loginPage');
    };

    const validateFields = () => {
        let valid = true;

        // First Name Validation
        if (firstName.length < 2 || firstName.length > 50) {
            setFirstNameError('First name must be between 2 and 50 characters.');
            valid = false;
        } else if (!/^[a-zA-Z]+$/.test(firstName)) {
            setFirstNameError('First name can only contain alphabetic characters.');
            valid = false;
        } else {
            setFirstNameError('');
        }

        // Last Name Validation
        if (lastName.length < 2 || lastName.length > 50) {
            setLastNameError('Last name must be between 2 and 50 characters.');
            valid = false;
        } else if (!/^[a-zA-Z]+$/.test(lastName)) {
            setLastNameError('Last name can only contain alphabetic characters.');
            valid = false;
        } else {
            setLastNameError('');
        }

        // Email Validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
            setEmailError('Please enter a valid email address.');
            valid = false;
        } else {
            setEmailError('');
        }

        // Password Validation
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
            valid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password)) {
            setPasswordError('Password must contain uppercase, lowercase, number, and special character.');
            valid = false;
        } else {
            setPasswordError('');
        }

        // Confirm Password Validation
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            valid = false;
        } else {
            setConfirmPasswordError('');
        }

        return valid;
    };

    useEffect(() => {
        const fetchAdoptionCenters = async () => {
            try {
                const response = await fetch(`${apiUrl}/adoption-centers`);
                if (!response.ok) {
                    throw new Error("Failed to fetch Adoption Centers");
                }
                const data = await response.json();
                setAdoptionCenters(data);
            } catch (error) {
                console.error("Error fetching adoption centers:", error);
                setMessage("Failed to load adoption centers.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdoptionCenters();
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;
        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, emailAddress, password, userType, adoptionId: selectedCenter }),
            });

            if (!response.ok) {
                throw new Error("Bad network response");
            }
            const result = await response.json();
            console.log(result);
            setMessage(result.message);
            if (response.status === 200) {
                router.push(`/loginPage`);
            }
        } catch (error) {
            console.error("Error registering: ", error);
            setMessage("Register failed. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #f0f4f7, #cfd9df)',
                padding: 2,
            }}
        >
            <Card sx={{ width: 400, boxShadow: 6, borderRadius: 4 }}>
                <CardContent sx={{ position: 'relative', p: 4 }}>
                    <Box
                        component="img"
                        src="Friends_Logo.png"
                        alt="Logo"
                        sx={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: 120,
                            height: 'auto',
                            marginBottom: 2,
                        }}
                    />
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ mt: 7, mb: 3, fontWeight: 500, color: '#333' }}
                    >
                        Register
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={firstName}
                            onChange={(e) => setFirst(e.target.value)}
                            required
                            sx={{ borderRadius: 2 }}
                            error={!!firstNameError}
                            helperText={firstNameError}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLast(e.target.value)}
                            required
                            sx={{ borderRadius: 2 }}
                            error={!!lastNameError}
                            helperText={lastNameError}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={emailAddress}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            sx={{ borderRadius: 2 }}
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            sx={{ borderRadius: 2 }}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            sx={{ borderRadius: 2 }}
                            error={!!confirmPasswordError}
                            helperText={confirmPasswordError}
                        />
                       <FormControl fullWidth margin="normal">
                            <InputLabel id="account-type-label">Account Type</InputLabel>
                            <Select
                                labelId="account-type-label"
                                id="userType"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                variant="outlined"
                                label="Account Type"
                                required
                            >
                                <MenuItem value="User">User</MenuItem>
                                <MenuItem value="adoptionCenter">Adoption Center</MenuItem>
                            </Select>
                        </FormControl>
                        {userType === 'adoptionCenter' && (
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel id="adoption-center-label">Adoption Center</InputLabel>
                                <Select
                                    labelId="adoption-center-label"
                                    value={selectedCenter}
                                    onChange={(e) => setSelectedCenter(e.target.value)}
                                >
                                    {loading && <MenuItem disabled>Loading...</MenuItem>}
                                    {error && <MenuItem disabled>{error}</MenuItem>}
                                    {!loading && !error && adoptionCenters.map((center) => (
                                        <MenuItem key={center.adoptionID} value={center.adoptionID}>
                                            {center.centerName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                marginTop: 3,
                                paddingY: 1.5,
                                borderRadius: 3,
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                            }}
                        >
                            Register
                        </Button>
                        <Button
                            variant="text"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: 2, textDecoration: 'underline' }}
                            onClick={() => router.push('/loginPage')}
                        >
                            Already Registered?
                        </Button>
                    </form>
                    {message && (
                        <Typography
                            variant="body2"
                            color="error"
                            align="center"
                            sx={{ marginTop: 2 }}
                        >
                            {message}
                        </Typography>
                    )}
                </CardContent>
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                message={message}
            />
        </Box>
    );
}