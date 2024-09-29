import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
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
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
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
