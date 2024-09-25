import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {Box, Card, CardContent, Typography} from "@mui/material";

export default function LoginPage() {
    const [data, setData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/login");
                if(!response.ok){
                    throw new Error("Bad network response");
                }
                const result = await response.text();
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box>
            <Head>
                <title>Login Page</title>
            </Head>
            <Typography variant="h3">{data}</Typography>
            <Card>
                <CardContent>
                    <Typography>Adding login abilities soon!</Typography>
                </CardContent>
            </Card>
        </Box>
    );
}