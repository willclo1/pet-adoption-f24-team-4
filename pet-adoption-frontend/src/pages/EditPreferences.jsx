import React, { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    Paper,
    Box,
    Typography,
    Chip,
    Slider,
    MenuItem,
    Select,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';

const EditPreferences = () => {
    const router = useRouter();
    const { userID, email } = router.query;
    const [preferences, setPreferences] = useState({});
    const [preferenceOptions, setPreferenceOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const headers = [
        { key: "Pet Type", type: "dropdown" },
        { key: "Cat Breeds", type: "chips" },
        { key: "Dog Breeds", type: "chips" },
        { key: "Fur Texture", type: "dropdown" },
        { key: "Fur Color", type: "chips" },
        { key: "Fur Length", type: "dropdown" },
        { key: "Pet Size", type: "dropdown" },
        { key: "Health Status", type: "dropdown" },
        { key: "Gender", type: "dropdown" },
        { key: "Spayed/Neutered", type: "dropdown" },
        { key: "Temperament", type: "chips" },
    ];

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in local storage. Redirecting to login.');
            router.push('/login');
            return null;
        }

        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    };

    const fetchAttributes = async () => {
        try {
            const response = await fetchWithAuth(`${apiUrl}/loadAttributes`);
            if (!response || !response.ok) throw new Error('Failed to fetch attributes');
            const attributes = await response.json();

            const mappedOptions = headers.reduce((acc, { key }, index) => {
                acc[key] = attributes[index] || [];
                return acc;
            }, {});

            setPreferenceOptions(mappedOptions);
        } catch (error) {
            console.error('Error fetching attributes:', error);
        }
    };

    const fetchUserPreferences = async () => {
        try {
            const response = await fetchWithAuth(`${apiUrl}/users/${userID}/getPref`);
            if (!response || !response.ok) throw new Error('Failed to fetch user preferences');

            const userPreferences = await response.json();
            const reconstructedPreferences = {};

            Object.entries(userPreferences).forEach(([key, value]) => {
                const [type, attribute] = key.split(':');
                if (["Fur Color", "Temperament", "Cat Breeds", "Dog Breeds"].includes(type)) {
                    if (!reconstructedPreferences[type]) reconstructedPreferences[type] = {};
                    reconstructedPreferences[type][attribute] = value;
                } else if (type === "Age") {
                    reconstructedPreferences[type] = parseInt(attribute, 10);
                } else {
                    reconstructedPreferences[type] = attribute || key;
                }
            });

            setPreferences(reconstructedPreferences);
        } catch (error) {
            console.error('Error fetching user preferences:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchAttributes();
            if (userID) await fetchUserPreferences();
            setLoading(false);
        };

        fetchData();
    }, [userID]);

    const togglePreference = (category, option) => {
        setPreferences((prev) => ({
            ...prev,
            [category]: {
                ...(prev[category] || {}),
                [option]: prev[category]?.[option] === 1 ? 0 : 1,
            },
        }));
    };

    const handleDropdownChange = (category, value) => {
        setPreferences((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    const handleAgeChange = (event, newValue) => {
        setPreferences((prev) => ({
            ...prev,
            Age: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const flattenedPreferences = {};

        Object.entries(preferences).forEach(([key, value]) => {
            if (typeof value === "object") {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    if (subValue === 1) {
                        flattenedPreferences[`${key}:${subKey}`] = 1;
                    }
                });
            } else if (key === "Age" && value) {
                flattenedPreferences[`Age:${value}`] = 1;
            } else if (value) {
                const attributeList = preferenceOptions[key] || [];
                if (attributeList.includes(value)) {
                    flattenedPreferences[`${key}:${value}`] = 1;
                } else {
                    flattenedPreferences[key] = 1;
                }
            }
        });

        try {
            const response = await fetchWithAuth(`${apiUrl}/users/${userID}/preferences`, {
                method: "PUT",
                body: JSON.stringify(flattenedPreferences),
            });

            if (response && response.ok) {
                alert("Preferences updated successfully!");
            } else {
                throw new Error("Failed to update preferences");
            }
        } catch (error) {
            console.error("Error updating preferences:", error);
            alert("Failed to update preferences.");
        }
    };

    const handleBackClick = () => {
        router.push(`/customer-home?email=${email}`);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3, mx: 'auto', width: '90%', maxWidth: '1200px' }}>
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={handleBackClick}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ ml: 2 }}>
                    Edit Preferences
                </Typography>
            </Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <form onSubmit={handleSubmit}>
                    {headers.map(({ key, type }) => (
                        <Accordion key={key} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">{key}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {type === "chips" ? (
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                        {(preferenceOptions[key] || []).map((option) => (
                                            <Chip
                                                key={option}
                                                label={option}
                                                onClick={() => togglePreference(key, option)}
                                                color={
                                                    preferences[key]?.[option] === 1
                                                        ? "primary"
                                                        : "default"
                                                }
                                                sx={{ borderRadius: '16px' }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Select
                                        value={preferences[key] || ""}
                                        onChange={(e) => handleDropdownChange(key, e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {(preferenceOptions[key] || []).map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    <Box mt={3}>
                        <Typography gutterBottom>Preferred Age</Typography>
                        <Slider
                            value={preferences.Age || 0}
                            onChange={handleAgeChange}
                            min={0}
                            max={20}
                            step={1}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button variant="outlined" onClick={handleBackClick}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Save Preferences
                        </Button>
                    </Box>
                </form>
            )}
        </Paper>
    );
};

export default EditPreferences;