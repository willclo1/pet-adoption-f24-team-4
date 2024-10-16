import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function Recommendation() {
    const [data, setData] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/recommendation`);
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
                <title>Recommendation</title>
            </Head>
            <Typography variant="h3">{data}</Typography>
            <Card>
                <CardContent>
                    <Typography>Work in progress, come back later :)</Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
