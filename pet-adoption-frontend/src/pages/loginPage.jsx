import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { useRouter } from 'next/router';
import PetsIcon from '@mui/icons-material/Pets';
import config from './config/config';


export default function LoginPage() {
    const [email, setEmail] = useState(''); // Replacing username with email
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userType, setUserType] = useState('');
    const router = useRouter(); // Initialize the router

    const handleForgotClick = () => {
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://${config.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password,  userType}), // Sending email instead of username
            });

            if (!response.ok) {
                throw new Error("Bad network response");
            }
            const result = await response.json();
            setMessage(result.message);

            // Route to customer home page if login is successful
            if (response.status === 200) {
                const userType = result.userType;
                if(userType == "User"){
                    router.push(`/customer-home?email=${email}`); 
                }
                else if(userType == "adoptionCenter"){
                    router.push(`/adoptionHome?email=${email}`); 
                }
                else{
            
                    setMessage("Login failed. Please try again.");
                }
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
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 2,
            }}
        >
            <Typography variant = "h1" sx={{ marginBottom: 8 }}>Whisker Works</Typography>
        
            <Card sx={{ width: 400, boxShadow: 7, marginTop: 7 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>Welcome</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email} // Replacing username with email
                            onChange={(e) => setEmail(e.target.value)} // Updating email instead of username
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
                        <Button
                        variant="text" // Text button style
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2, textDecoration: 'underline' }} // Underline the text for emphasis
                        onClick={() => handleForgotClick()} // You can define this function to handle the action
                    >
                        Forgot Username/Password?
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
