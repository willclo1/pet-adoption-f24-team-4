import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";

export default function RegisterPage() {
    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [emailAddress, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({firstName, lastName, emailAddress, password }),
            });

            if (!response.ok) {
                throw new Error("Bad network response");
            }
            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error("Error logging in: ", error);
            setMessage("Login failed. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 2,
            }}
        >
            <Card sx={{ width: 400, boxShadow: 3 }}>
                <CardContent>
                     <Box
                        component="img"
                        src='Friends_Logo.png'
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            width: 100,
                            height: 'auto',
                        }}
                    />
                    <Typography variant="h4" align="center" gutterBottom>
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
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLast(e.target.value)}
                            required
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={emailAddress}
                            onChange={(e) => setUsername(e.target.value)}
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
                        >
                            Login
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
        </Box>
    );
}
