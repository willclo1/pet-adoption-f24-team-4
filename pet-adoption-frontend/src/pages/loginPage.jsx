import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {Box, Card, CardContent, Typography, Stack} from "@mui/material";

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
                setData(result);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
    <>
        <Head>
            <title>Login</title>
        </Head>
        <main>
            <Stack sx={{paddingTop: 4, paddingLeft: 4}} alignItems='flex-start' gap={2}>
                <Box>
                    <Typography variant="h3">{data}</Typography>
                    <Card>
                        <CardContent>
                            <Typography>Adding login abilities soon!</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Stack>
        </main>
    </>
    );
}