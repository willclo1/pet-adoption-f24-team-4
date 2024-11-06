import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import { useRouter } from 'next/router';

export default function LoginPage() {
    const [emailAddress, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const [tokenStored, setTokenStored] = useState(false);
    const router = useRouter();// To check if token was stored successfully
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailAddress, password }),
            });
            console.log('WE ETNERED');
            console.log(emailAddress);
            console.log(password);


            console.log(`${apiUrl}/login`);
            console.log("Response status:", response.status);
    
            if (!response.ok) {
                const errorMessage = await response.text();
                setIsSuccess(false);
                setMessage(errorMessage); // Display error message from backend
                setTokenStored(false); // Reset token stored status
                return;
            }
    
            const result = await response.json();
            
    
            // Check if token exists in the response
            if (result.token) {
                setIsSuccess(true);
                setMessage("Login successful!");
    
                // Store the JWT token in localStorage
                
                localStorage.setItem('token', result.token);
                setTokenStored(true); // Set token stored status to true
                if (result.adoptionId) {
                    router.push(`/adoptionHome?email=${emailAddress}`); 
                } else {
                    router.push(`/customer-home?email=${emailAddress}`); 
                }
            } else {
                setIsSuccess(false);
                setMessage("Login failed. Please try again.");
                setTokenStored(false); // Reset token stored status
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            setMessage("Login failed. Please try again.");
            setIsSuccess(false);
            setTokenStored(false); // Reset token stored status
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
                            value={emailAddress} 
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
                    {tokenStored && (
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ marginTop: 2, color: 'blue' }}
                        >
                            Token stored successfully.
                        </Typography>
                    )}
                    {!tokenStored && isSuccess && (
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ marginTop: 2, color: 'orange' }}
                        >
                            Login successful, but token storage failed.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
} 
