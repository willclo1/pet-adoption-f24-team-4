import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Send the credentials as JSON
            });

            if (!response.ok) {
                throw new Error("Bad network response");
            }
            const result = await response.json();
            setMessage(result.message); // Update state with the response message
        } catch (error) {
            console.error("Error logging in: ", error);
            setMessage("Login failed. Please try again.");
        }
    };

    return (
        <Box>
            <Typography variant="h3">Login</Typography>
            <Card>
                <CardContent>
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
                        <Button type="submit" variant="contained" color="primary">
                            Login
                        </Button>
                    </form>
                    {message && <Typography>{message}</Typography>} {/* Display any messages */}
                </CardContent>
            </Card>
        </Box>
    );
}
