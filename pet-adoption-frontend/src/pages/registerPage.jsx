import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { useRouter } from 'next/router'; 

export default function RegisterPage() {
    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [emailAddress, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter(); 

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
            if(response.status == 200){
                router.push(`/loginPage`);
            }
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
                        />

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
