import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
} from '@mui/material';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';

export default function AllPets() {
    const router = useRouter();
    const { email } = router.query;
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currPet, setCurrPet] = useState(null);
    const [filterOptions, setFilterOptions] = useState({});
    const [filters, setFilters] = useState({});
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const filterTitles = [
        "Species",
        "Cat Breed",
        "Dog Breed",
        "Fur Type",
        "Fur Color",
        "Fur Length",
        "Size",
        "Health",
        "Gender",
        "Spayed / Neutered",
        "Temperament",
    ];

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await fetch(`${apiUrl}/loadAttributes`);
                if (!response.ok) throw new Error("Failed to load attributes");
                const data = await response.json();
                const options = {};
                filterTitles.forEach((title, index) => {
                    options[title] = data[index];
                });
                setFilterOptions(options);
                setFilters(
                    Object.fromEntries(filterTitles.map((title) => [title, []]))
                );
            } catch (err) {
                console.error("Error fetching attributes:", err);
                setError("Failed to load attributes.");
            }
        };

        fetchAttributes();
    }, [apiUrl]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch(`${apiUrl}/pets`);
                if (!response.ok) throw new Error("Failed to fetch pets");
                const data = await response.json();
                setPets(data);
                setFilteredPets(data);
            } catch (err) {
                console.error("Error fetching pets:", err);
                setError("Failed to load pets.");
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [apiUrl]);

    const handleFilterChange = (key, values) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: values,
        }));
    };

    useEffect(() => {
        const applyFilters = () => {
            const filtered = pets.filter((pet) => {
                const petAttributes = pet.attributes.reduce((acc, attr) => {
                    const [key, value] = attr.split(":");
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(value.trim());
                    return acc;
                }, {});

                return Object.entries(filters).every(([key, selectedValues]) => {
                    if (!selectedValues.length) return true;
                    return selectedValues.some((value) => petAttributes[key]?.includes(value));
                });
            });

            setFilteredPets(filtered);
        };

        applyFilters();
    }, [filters, pets]);

    const handleAdopt = () => {
        if (currPet && currPet.center && email) {
            const adoptionCenterName = encodeURIComponent(currPet.center.centerName); // Encode the center name for URL safety
            router.push(`/message?email=${email}&centerName=${adoptionCenterName}`);
        } else if (!email) {
            router.push('/loginPage');
        }
    };
    const handleBack = () =>{
        if(email){
            router.push(`/viewCenters?email=${email}`)
        }
        else{
            router.push(`/viewCenters`)
        }
    }

    if (loading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );

    if (error)
        return (
            <Box sx={{ padding: 4, textAlign: "center" }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );

    return (
        <main>
            <NavBar />
            <Box sx={{ padding: 4 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        sx={{ marginBottom: 2 }}
                    >
                        Back
                    </Button>
                <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold', textAlign: 'center' }}>
                    Find Your Perfect Pet
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2} marginBottom={4} justifyContent="center">
                    {filterTitles.map((title) => (
                        <Autocomplete
                            key={title}
                            multiple
                            options={filterOptions[title] || []}
                            getOptionLabel={(option) => option}
                            onChange={(e, values) => handleFilterChange(title, values)}
                            renderInput={(params) => (
                                <TextField {...params} label={title} variant="outlined" />
                            )}
                            sx={{ width: 300 }}
                        />
                    ))}
                </Box>
                <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold', textAlign: 'center' }}>
                    Available Pets
                </Typography>
                {filteredPets.length === 0 ? (
                    <Typography textAlign="center">No pets match the selected filters.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredPets.map((pet) => (
                            <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                <Card sx={{ boxShadow: 3, borderRadius: 3, padding: 2 }}>
                                    <Avatar
                                        src={
                                            pet.profilePicture?.imageData
                                                ? `data:image/png;base64,${pet.profilePicture.imageData}`
                                                : "/placeholder-pet.png"
                                        }
                                        alt={pet.name}
                                        sx={{
                                            width: "100%",
                                            height: 200,
                                            objectFit: "cover",
                                            marginBottom: 2,
                                        }}
                                    />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {pet.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                        Species:{" "}
                                        {pet.attributes
                                            .find((attr) => attr.startsWith("Species:"))
                                            ?.split(":")[1] || "Unknown"}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => setCurrPet(pet)}
                                    >
                                        View Details
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            {currPet && (
                <Dialog open={!!currPet} onClose={() => setCurrPet(null)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{currPet.name}</DialogTitle>
                    <DialogContent>
                        <Avatar
                            src={
                                currPet.profilePicture?.imageData
                                    ? `data:image/png;base64,${currPet.profilePicture.imageData}`
                                    : "/placeholder-pet.png"
                            }
                            alt={currPet.name}
                            sx={{
                                width: "100%",
                                height: 300,
                                objectFit: "cover",
                                marginBottom: 2,
                                borderRadius: 2,
                            }}
                        />
                        {Object.entries(
                            currPet.attributes.reduce((acc, attr) => {
                                const [key, value] = attr.split(":");
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(value.trim());
                                return acc;
                            }, {})
                        ).map(([key, values], index) => (
                            <Typography key={index} variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>{key}:</strong> {values.join(", ")}
                            </Typography>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCurrPet(null)} color="secondary">
                            Close
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleAdopt}>
                            Adopt
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </main>
    );
}