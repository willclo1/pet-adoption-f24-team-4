import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useRouter } from 'next/router'; 

export default function RegisterPage() {
    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [emailAddress, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userType, setUserType] = useState('User');
    const [selectedCenter, setSelectedCenter] = useState('');
    const [adoptionCenters, setAdoptionCenters] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const router = useRouter(); 

    const handleRegistered = () => {
        router.push('/loginPage');
    }

    useEffect(()=> {
        const fetchAdoptionCenters = async() => {
            try{
                const respose = await fetch("http://localhost:8080/adoption-centers");
                if(!respose.ok){
                    throw new Error("Failed to fetch Adoption Centers")
                }
                const data = await respose.json();
                setAdoptionCenters(data);
            }
            catch (error) {
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
        try {
            const response = await fetch("http://localhost:8080/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({firstName, lastName, emailAddress, password, userType,
                    adoptionId: selectedCenter}),
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
                                <MenuItem value="adoptionCenter">adoptionCenter</MenuItem>
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
                            onClick={() => handleRegistered()}
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
        </Box>
    );
}
