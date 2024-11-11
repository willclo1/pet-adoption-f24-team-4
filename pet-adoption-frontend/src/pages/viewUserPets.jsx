import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import NavBar from '@/components/NavBar';

export default function AdoptionHome() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    return (
        <main>
            <NavBar />
            <Card>
                <CardContent>
                    <Typography>Your pets will be here!</Typography>
                </CardContent>
            </Card>
        </main>
    );
}