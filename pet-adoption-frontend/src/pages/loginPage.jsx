import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { useRouter } from 'next/router';
import PetsIcon from '@mui/icons-material/Pets';

export default function LoginPage() {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), 
            });

            if (!response.ok) {
                throw new Error("Bad network response");
            }

            const result = await response.json();

            if (response.status === 200 && result.token) {
                setIsSuccess(true);
                setMessage("Login successful!");

                // Store the JWT token in localStorage or sessionStorage
                localStorage.setItem('token', result.token);

                // Optionally, you can also store user data (like email) for future use
                localStorage.setItem('userEmail', email);

                // Redirect user after successful login, you can use user type if needed
                router.push(`/customer-home?email=${email}`);
            } else {
                setIsSuccess(false);
                setMessage("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            setMessage("Login failed. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 2,
            }}
        >
            <Typography variant="h1" sx={{ marginBottom: 8 }}>Whisker Works</Typography>

            <Card sx={{ width: 400, boxShadow: 7, marginTop: 7 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
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
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: 2 }}
                            endIcon={<PetsIcon />}
                        >
                            Login
                        </Button>
                    </form>
                    {message && (
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ marginTop: 2, color: isSuccess ? 'green' : 'red' }}
                        >
                            {message}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
