import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function AdoptionHome() {
    const [data, setData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/AdoptHome");
                if (!response.ok) {
                    throw new Error("Bad network response");
                }
                const result = await response.text();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box>
            <Head>
                <title>Adoption Home</title>
            </Head>
            <Typography variant="h3">{data}</Typography>
            <Card>
                <CardContent>
                    <Typography>COME BACK SOON FOR A FINAL PRODUCT!!!</Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

    
    

